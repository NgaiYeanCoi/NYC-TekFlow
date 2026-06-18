package xyz.nyc.tekflow.aspect;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* xyz.nyc.tekflow.controller..*(..)) || @annotation(xyz.nyc.tekflow.aspect.PerfMonitor)")
    public Object monitor(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            HttpServletRequest request = currentRequest();
            if (request != null) {
                log.info("api method={} path={} user={} elapsedMs={}",
                        request.getMethod(),
                        request.getRequestURI(),
                        currentUser(),
                        elapsed);
            } else {
                log.info("service method={} elapsedMs={}", joinPoint.getSignature().toShortString(), elapsed);
            }
        }
    }

    @AfterReturning("@annotation(auditAction)")
    public void auditSuccess(AuditAction auditAction) {
        log.info("audit action={} user={} result=success", auditAction.value(), currentUser());
    }

    @AfterThrowing(pointcut = "@annotation(auditAction)", throwing = "ex")
    public void auditFailure(AuditAction auditAction, Throwable ex) {
        log.warn("audit action={} user={} result=failure reason={}", auditAction.value(), currentUser(), ex.getMessage());
    }

    private HttpServletRequest currentRequest() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
            return attributes.getRequest();
        }
        return null;
    }

    private String currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return "anonymous";
        }
        return authentication.getName();
    }
}

