package xyz.nyc.tekflow.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import xyz.nyc.tekflow.common.BusinessException;
import xyz.nyc.tekflow.entity.Post;

class PostRulesTest {
    @Test
    void publicPublishedPostRequiresContent() {
        Post post = new Post();
        post.setTitle("Public");
        post.setType("tech_note");
        post.setVisibility("public");
        post.setStatus("published");

        BusinessException ex = assertThrows(BusinessException.class, () -> PostRules.validate(post));

        assertEquals(400, ex.code());
    }

    @Test
    void schoolNoticeRequiresDateOrDeadline() {
        Post post = new Post();
        post.setTitle("School");
        post.setType("school_notice");
        post.setVisibility("school");
        post.setStatus("published");
        post.setNoticePriority("urgent");

        BusinessException ex = assertThrows(BusinessException.class, () -> PostRules.validate(post));

        assertEquals(400, ex.code());
    }

    @Test
    void schoolNoticeWithDeadlineCanPublish() {
        Post post = new Post();
        post.setTitle("School");
        post.setType("school_notice");
        post.setVisibility("school");
        post.setStatus("published");
        post.setDeadlineAt(LocalDateTime.now().plusDays(1));
        post.setNoticePriority("urgent");
        post.setIsNoticeDone(false);

        assertDoesNotThrow(() -> PostRules.validate(post));
    }

    @Test
    void doneNoticeStatusOverridesTime() {
        Post post = new Post();
        post.setType("school_notice");
        post.setVisibility("school");
        post.setIsNoticeDone(true);
        post.setEventDate(LocalDate.now());
        post.setDeadlineAt(LocalDateTime.now().minusDays(1));

        assertEquals("done", PostRules.calculateNoticeStatus(post));
    }
}

