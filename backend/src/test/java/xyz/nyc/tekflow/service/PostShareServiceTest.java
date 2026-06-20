package xyz.nyc.tekflow.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.dto.PostShareDtos.PostShareRequest;
import xyz.nyc.tekflow.dto.PostShareDtos.ShareOpenRequest;
import xyz.nyc.tekflow.entity.Attachment;
import xyz.nyc.tekflow.entity.Post;
import xyz.nyc.tekflow.entity.PostShare;
import xyz.nyc.tekflow.mapper.PostShareMapper;

@ExtendWith(MockitoExtension.class)
class PostShareServiceTest {
    @Mock
    private PostShareMapper postShareMapper;
    @Mock
    private PostService postService;

    private PasswordEncoder passwordEncoder;
    private PostShareService service;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        service = new PostShareService(postShareMapper, postService, passwordEncoder);
    }

    @Test
    void enableShareUsesDefaultExpiryAndHashesAccessCode() {
        Post post = shareablePost();
        AtomicReference<PostShare> saved = new AtomicReference<>();
        when(postService.requirePost(1L)).thenReturn(post);
        when(postShareMapper.findLatestByPostId(1L)).thenAnswer(invocation -> saved.get());
        when(postShareMapper.countByToken(anyString())).thenReturn(0L);
        doAnswer(invocation -> {
            PostShare share = invocation.getArgument(0);
            share.setId(10L);
            saved.set(share);
            return 1;
        }).when(postShareMapper).insertShare(any(PostShare.class));

        var response = service.enableOrUpdate(1L, new PostShareRequest("open-code", false, null, false));

        assertTrue(response.active());
        assertTrue(response.hasAccessCode());
        assertTrue(response.expiresAt().isAfter(LocalDateTime.now().plusDays(6)));
        assertTrue(passwordEncoder.matches("open-code", saved.get().getAccessCodeHash()));
    }

    @Test
    void openWithCorrectAccessCodeIncrementsAccessCount() {
        PostShare share = activeShare();
        share.setAccessCodeHash(passwordEncoder.encode("open-code"));
        when(postShareMapper.findByToken("token")).thenReturn(share);
        when(postService.findActivePost(1L)).thenReturn(shareablePost());

        assertDoesNotThrow(() -> service.open("token", new ShareOpenRequest("open-code")));

        verify(postShareMapper).incrementAccess(2L);
    }

    @Test
    void openWithWrongAccessCodeIsRejectedWithoutCount() {
        PostShare share = activeShare();
        share.setAccessCodeHash(passwordEncoder.encode("open-code"));
        when(postShareMapper.findByToken("token")).thenReturn(share);
        when(postService.findActivePost(1L)).thenReturn(shareablePost());

        BusinessException ex = assertThrows(BusinessException.class, () -> service.open("token", new ShareOpenRequest("bad-code")));

        assertEquals(403, ex.code());
        verify(postShareMapper, never()).incrementAccess(2L);
    }

    @Test
    void expiredShareIsRejectedWithoutCount() {
        PostShare share = activeShare();
        share.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        when(postShareMapper.findByToken("token")).thenReturn(share);
        when(postService.findActivePost(1L)).thenReturn(shareablePost());

        BusinessException ex = assertThrows(BusinessException.class, () -> service.open("token", new ShareOpenRequest(null)));

        assertEquals(404, ex.code());
        verify(postShareMapper, never()).incrementAccess(2L);
    }

    @Test
    void rotateShareReplacesToken() {
        PostShare share = activeShare();
        share.setToken("old-token");
        when(postService.requirePost(1L)).thenReturn(shareablePost());
        when(postShareMapper.findLatestByPostId(1L)).thenReturn(share);
        when(postShareMapper.countByToken(anyString())).thenReturn(0L);
        ArgumentCaptor<PostShare> captor = ArgumentCaptor.forClass(PostShare.class);

        service.rotate(1L);

        verify(postShareMapper).updateShare(captor.capture());
        assertNotEquals("old-token", captor.getValue().getToken());
        assertEquals("active", captor.getValue().getStatus());
    }

    @Test
    void sharedAttachmentDownloadRequiresMatchingPostAndIncrementsCount() {
        PostShare share = activeShare();
        Attachment attachment = new Attachment();
        attachment.setId(5L);
        attachment.setPostId(1L);
        when(postShareMapper.findByToken("token")).thenReturn(share);
        when(postService.findActivePost(1L)).thenReturn(shareablePost());

        Long shareId = assertDoesNotThrow(() -> service.verifyAttachmentAccess("token", attachment, null));

        assertEquals(2L, shareId);
        verify(postShareMapper, never()).incrementAttachmentDownload(2L);
    }

    @Test
    void recordAttachmentDownloadIncrementsCount() {
        service.recordAttachmentDownload(2L);

        verify(postShareMapper).incrementAttachmentDownload(2L);
    }

    @Test
    void sharedAttachmentForDifferentPostIsRejected() {
        PostShare share = activeShare();
        Attachment attachment = new Attachment();
        attachment.setId(5L);
        attachment.setPostId(99L);
        when(postShareMapper.findByToken("token")).thenReturn(share);
        when(postService.findActivePost(1L)).thenReturn(shareablePost());

        BusinessException ex = assertThrows(BusinessException.class, () -> service.verifyAttachmentAccess("token", attachment, null));

        assertEquals(404, ex.code());
        verify(postShareMapper, never()).incrementAttachmentDownload(2L);
    }

    private Post shareablePost() {
        Post post = new Post();
        post.setId(1L);
        post.setTitle("Shareable");
        post.setVisibility("unlisted");
        post.setStatus("published");
        post.setType("study_note");
        return post;
    }

    private PostShare activeShare() {
        PostShare share = new PostShare();
        share.setId(2L);
        share.setPostId(1L);
        share.setToken("token");
        share.setStatus("active");
        share.setExpiresAt(LocalDateTime.now().plusDays(1));
        share.setAccessCount(0L);
        share.setAttachmentDownloadCount(0L);
        return share;
    }
}
