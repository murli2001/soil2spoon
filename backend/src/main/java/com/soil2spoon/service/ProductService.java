package com.soil2spoon.service;

import com.soil2spoon.domain.Category;
import com.soil2spoon.domain.Product;
import com.soil2spoon.domain.ProductHighlights;
import com.soil2spoon.domain.ProductInformation;
import com.soil2spoon.dto.ProductHighlightsRequest;
import com.soil2spoon.dto.ProductInformationRequest;
import com.soil2spoon.dto.ProductRequest;
import com.soil2spoon.dto.ProductResponse;
import com.soil2spoon.repository.CategoryRepository;
import com.soil2spoon.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> findAll(String categoryId, Pageable pageable) {
        if (categoryId == null || categoryId.isBlank()) {
            return productRepository.findAll(pageable).map(ProductResponse::from);
        }
        return productRepository.findAllByCategoryOptional(categoryId, pageable).map(ProductResponse::from);
    }

    public List<ProductResponse> findFeatured() {
        return productRepository.findByFeaturedTrue().stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> findTrending() {
        return productRepository.findByTrendingTrue().stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    public ProductResponse findBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .map(ProductResponse::from)
                .orElse(null);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId() != null ? request.getCategoryId() : "pastes")
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + request.getCategoryId()));
        Product product = toEntity(request, category, null);
        product = productRepository.save(product);
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        Category category = product.getCategory();
        if (request.getCategoryId() != null && !request.getCategoryId().equals(category.getId())) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + request.getCategoryId()));
        }
        applyRequestToProduct(request, category, product);
        product = productRepository.save(product);
        return ProductResponse.from(product);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Updates the managed product in place from the request.
     * In-place update ensures JPA dirty-checking persists @Embedded fields (highlights, information)
     * correctly; merging a newly built entity can leave embeddable columns unupdated.
     */
    private void applyRequestToProduct(ProductRequest r, Category category, Product product) {
        product.setName(nullSafe(r.getName(), ""));
        product.setSlug(nullSafe(r.getSlug(), ""));
        product.setPrice(r.getPrice() != null ? r.getPrice() : 0);
        product.setOriginalPrice(r.getOriginalPrice());
        product.setCategory(category);
        product.setRating(r.getRating() != null ? r.getRating() : 0.0);
        product.setReviewCount(r.getReviewCount() != null ? r.getReviewCount() : 0);
        product.setNetQty(r.getNetQty());
        product.setImage(r.getImage());
        product.setImages(buildImagesList(r));
        product.setFallbackImage(r.getFallbackImage());
        product.setDescription(r.getDescription());
        product.setFeatured(Boolean.TRUE.equals(r.getFeatured()));
        product.setTrending(Boolean.TRUE.equals(r.getTrending()));
        product.setHighlights(buildHighlights(r));
        product.setInformation(buildInformation(r));
    }

    private Product toEntity(ProductRequest r, Category category, Long existingId) {
        return Product.builder()
                .id(existingId)
                .name(nullSafe(r.getName(), ""))
                .slug(nullSafe(r.getSlug(), ""))
                .price(r.getPrice() != null ? r.getPrice() : 0)
                .originalPrice(r.getOriginalPrice())
                .category(category)
                .rating(r.getRating() != null ? r.getRating() : 0.0)
                .reviewCount(r.getReviewCount() != null ? r.getReviewCount() : 0)
                .netQty(r.getNetQty())
                .image(r.getImage())
                .images(buildImagesList(r))
                .fallbackImage(r.getFallbackImage())
                .description(r.getDescription())
                .featured(Boolean.TRUE.equals(r.getFeatured()))
                .trending(Boolean.TRUE.equals(r.getTrending()))
                .highlights(buildHighlights(r))
                .information(buildInformation(r))
                .build();
    }

    private static String nullSafe(String value, String fallback) {
        return value != null ? value : fallback;
    }

    private List<String> buildImagesList(ProductRequest r) {
        List<String> images = r.getImages() != null ? new ArrayList<>(r.getImages()) : new ArrayList<>();
        if (r.getImage() != null && !r.getImage().isBlank() && images.isEmpty()) {
            images.add(r.getImage());
        }
        return images;
    }

    private ProductHighlights buildHighlights(ProductRequest r) {
        if (r.getHighlights() == null) {
            return new ProductHighlights();
        }
        ProductHighlightsRequest req = r.getHighlights();
        return ProductHighlights.builder()
                .brand(req.getBrand())
                .productType(req.getProductType())
                .dietaryPreference(req.getDietaryPreference())
                .keyFeatures(req.getKeyFeatures())
                .flavour(req.getFlavour())
                .ingredients(req.getIngredients())
                .allergenInformation(req.getAllergenInformation())
                .weight(req.getWeight())
                .unit(req.getUnit())
                .packagingType(req.getPackagingType())
                .build();
    }

    private ProductInformation buildInformation(ProductRequest r) {
        if (r.getInformation() == null) {
            return null;
        }
        ProductInformationRequest req = r.getInformation();
        return ProductInformation.builder()
                .disclaimer(req.getDisclaimer())
                .customerCareDetails(req.getCustomerCareDetails())
                .sellerName(req.getSellerName())
                .sellerAddress(req.getSellerAddress())
                .sellerLicenseNo(req.getSellerLicenseNo())
                .manufacturerName(req.getManufacturerName())
                .countryOfOrigin(req.getCountryOfOrigin())
                .shelfLife(req.getShelfLife())
                .build();
    }
}
