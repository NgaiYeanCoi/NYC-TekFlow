package xyz.nyc.tekflow.service;

import java.text.Normalizer;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class SlugService {
    public String normalize(String value) {
        if (value == null || value.isBlank()) {
            return "untitled";
        }
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-")
                .replaceAll("(^-|-$)", "");
        if (normalized.isBlank()) {
            return "untitled";
        }
        return normalized;
    }
}

