package com.soil2spoon.config;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.soil2spoon.domain.Category;
import com.soil2spoon.domain.Product;
import com.soil2spoon.domain.ProductHighlights;
import com.soil2spoon.domain.Review;
import com.soil2spoon.domain.User;
import com.soil2spoon.repository.CartItemRepository;
import com.soil2spoon.repository.CategoryRepository;
import com.soil2spoon.repository.OrderRepository;
import com.soil2spoon.repository.ProductRepository;
import com.soil2spoon.repository.ReviewRepository;
import com.soil2spoon.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataLoader implements ApplicationRunner {

    @Value("${app.dev.seed.force:false}")
    private boolean forceSeed;

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (forceSeed) {
            reviewRepository.deleteAll();
            orderRepository.deleteAll();
            cartItemRepository.deleteAll();
            productRepository.deleteAll();
            userRepository.deleteAll();
            categoryRepository.deleteAll();
        } else if (categoryRepository.count() > 0) {
            ensureAdminUserExists();
            return;
        }

        Category spices = Category.builder().id("spices").name("Spices").icon("🌶️").build();
        Category pastes = Category.builder().id("pastes").name("Pastes").icon("🫙").build();
        Category powders = Category.builder().id("powders").name("Powders").icon("🧂").build();
        categoryRepository.saveAll(List.of(spices, pastes, powders));

        // Your Cloudinary base (v1771775127 = version; add more product public IDs as you upload).
        String cloudinaryBase = "https://res.cloudinary.com/ddhzj2jfw/image/upload/v1771775127";
        // String garlicPasteImg = cloudinaryBase + "/garlic-paste_vgxtgb.png";
        // Reuse or replace with product-specific URLs when you have them (e.g. garlic-ginger-paste_xxx.png).
        // String otherImg = garlicPasteImg;

        ProductHighlights pasteHighlights = ProductHighlights.builder()
                .brand("Soil2Spoon")
                .productType("Paste")
                .dietaryPreference("Veg")
                .keyFeatures("Made with fresh garlic, no preservatives, no added colours, perfect for curries and marinades, stays fresh in fridge.")
                .flavour("Garlic")
                .ingredients("Garlic, Water, Citric Acid")
                .allergenInformation("Contains: None known. Processed in a facility that handles tree nuts.")
                .weight("200 g")
                .unit("1 pack (200 g)")
                .packagingType("Jar")
                .build();

        productRepository.save(Product.builder()
                .name("Garlic Paste")
                .slug("garlic-paste")
                .price(299)
                .originalPrice(349)
                .category(pastes)
                .rating(4.8)
                .reviewCount(1247)
                .netQty("1 pack (200 g)")
                .image(cloudinaryBase + "/garlic-paste_vgxtgb.png")
                .images(List.of(cloudinaryBase + "/garlic-paste_vgxtgb.png"))
                .fallbackImage(cloudinaryBase + "/garlic-paste_vgxtgb.png")
                .description("Fresh, pure garlic paste. No preservatives. Perfect for curries, stir-fries and marinades.")
                .featured(true)
                .trending(true)
                .highlights(pasteHighlights)
                .build());

        ProductHighlights ggPasteHighlights = ProductHighlights.builder()
                .brand("Soil2Spoon")
                .productType("Paste")
                .dietaryPreference("Veg")
                .keyFeatures("Fresh garlic and ginger blend, no preservatives, time-saving for daily cooking, authentic flavour.")
                .flavour("Garlic & Ginger")
                .ingredients("Garlic, Ginger, Water, Citric Acid")
                .allergenInformation("Contains: None known.")
                .weight("200 g")
                .unit("1 pack (200 g)")
                .packagingType("Jar")
                .build();

        productRepository.save(Product.builder()
                .name("Garlic Ginger Paste")
                .slug("garlic-ginger-paste")
                .price(249)
                .originalPrice(null)
                .category(pastes)
                .rating(4.9)
                .reviewCount(892)
                .netQty("1 pack (200 g)")
                .image(cloudinaryBase + "/ginger-garlic-paste_z7nfu9.png")
                .images(List.of(
                        cloudinaryBase + "/ginger-garlic-paste_z7nfu9.png",
                        cloudinaryBase + "/ginger-garlic-paste_z7nfu9.png"))
                .fallbackImage(null)
                .description("Pure garlic and ginger paste. Convenient and authentic flavour.")
                .featured(true)
                .trending(true)
                .highlights(ggPasteHighlights)
                .build());

        ProductHighlights powderHighlights = ProductHighlights.builder()
                .brand("Soil2Spoon")
                .productType("Powder")
                .dietaryPreference("Veg")
                .keyFeatures("Fine texture, long shelf life, no added MSG, ideal for seasoning and dry rubs.")
                .flavour("Garlic")
                .ingredients("Garlic (100%)")
                .allergenInformation("Contains: None known.")
                .weight("100 g")
                .unit("1 pack (100 g)")
                .packagingType("Pouch")
                .build();

        productRepository.save(Product.builder()
                .name("Garlic Powder")
                .slug("garlic-powder")
                .price(199)
                .originalPrice(null)
                .category(powders)
                .rating(4.9)
                .reviewCount(2103)
                .netQty("1 pack (100 g)")
                .image(cloudinaryBase + "/garlic-powder_bcxrih.png")
                .images(List.of(cloudinaryBase + "/garlic-powder_bcxrih.png"))
                .fallbackImage(cloudinaryBase + "/garlic-powder_bcxrih.png")
                .description("Fine garlic powder. Convenient, long-lasting. Sprinkle into any dish.")
                .featured(true)
                .trending(true)
                .highlights(powderHighlights)
                .build());

        ProductHighlights chilliHighlights = ProductHighlights.builder()
                .brand("Soil2Spoon")
                .productType("Spice")
                .dietaryPreference("Veg")
                .keyFeatures("Vibrant colour and heat, no artificial colours, authentic Indian spice, perfect for curries and snacks.")
                .flavour("Spicy")
                .ingredients("Red Chilli (100%)")
                .allergenInformation("Contains: Chilli. May contain: traces of other spices.")
                .weight("100 g")
                .unit("1 pack (100 g)")
                .packagingType("Pouch")
                .build();

        productRepository.save(Product.builder()
                .name("Red Chilli Powder")
                .slug("red-chilli-powder")
                .price(199)
                .originalPrice(249)
                .category(spices)
                .rating(4.4)
                .reviewCount(1892)
                .netQty("1 pack (100 g)")
                .image(cloudinaryBase + "/red-chilli-powder_upaodo.png")
                .images(List.of(cloudinaryBase + "/red-chilli-powder_upaodo.png"))
                .fallbackImage(null)
                .description("Vibrant red chilli powder. Heat and colour for every curry and snack.")
                .featured(false)
                .trending(true)
                .highlights(chilliHighlights)
                .build());

        if (reviewRepository.count() == 0) {
            Product garlicPaste = productRepository.findBySlug("garlic-paste").orElseThrow();
            Product garlicGingerPaste = productRepository.findBySlug("garlic-ginger-paste").orElseThrow();
            Product garlicPowder = productRepository.findBySlug("garlic-powder").orElseThrow();
            Product redChilliPowder = productRepository.findBySlug("red-chilli-powder").orElseThrow();

            reviewRepository.saveAll(List.of(
                    Review.builder().product(garlicPaste).author("Priya S.").rating(5).reviewDate(LocalDate.of(2024, 1, 15)).text("Best garlic paste I've used. Fresh smell, no preservatives. Stays good in the fridge for weeks.").build(),
                    Review.builder().product(garlicPaste).author("Rahul M.").rating(4).reviewDate(LocalDate.of(2024, 1, 8)).text("Convenient and saves a lot of time. Taste is close to fresh garlic. Would buy again.").build(),
                    Review.builder().product(garlicPaste).author("Anita K.").rating(5).reviewDate(LocalDate.of(2024, 1, 2)).text("Perfect for curries and marinades. My family loves the flavour. Soil2Spoon never disappoints.").build(),
                    Review.builder().product(garlicGingerPaste).author("Kavita N.").rating(5).reviewDate(LocalDate.of(2024, 1, 12)).text("Garlic and ginger together — so handy! Saves me 10 minutes every time I cook.").build(),
                    Review.builder().product(garlicGingerPaste).author("Suresh P.").rating(4).reviewDate(LocalDate.of(2024, 1, 5)).text("Fresh and aromatic. Good for tea and curries. Will order again.").build(),
                    Review.builder().product(garlicPowder).author("Deepa L.").rating(5).reviewDate(LocalDate.of(2024, 1, 10)).text("Fine texture, strong flavour. A little goes a long way. Great for seasoning.").build(),
                    Review.builder().product(garlicPowder).author("Arun J.").rating(4).reviewDate(LocalDate.of(2024, 1, 1)).text("Consistent quality. I use it in marinades and dry rubs. Good value.").build(),
                    Review.builder().product(redChilliPowder).author("Manoj B.").rating(5).reviewDate(LocalDate.of(2024, 1, 11)).text("Perfect heat and colour. My curries look and taste like the real deal. Love it!").build(),
                    Review.builder().product(redChilliPowder).author("Sunita H.").rating(4).reviewDate(LocalDate.of(2024, 1, 4)).text("Spicy and vibrant. A staple in my kitchen. Soil2Spoon quality is top notch.").build()
            ));
            updateProductReviewStats(garlicPaste);
            updateProductReviewStats(garlicGingerPaste);
            updateProductReviewStats(garlicPowder);
            updateProductReviewStats(redChilliPowder);
        }

        if (userRepository.count() == 0) {
            Instant now = Instant.now();
            userRepository.save(User.builder()
                    .email("test@soil2spoon.com")
                    .password(passwordEncoder.encode("password123"))
                    .name("Test User")
                    .role("USER")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());
            userRepository.save(User.builder()
                    .email("admin@soil2spoon.com")
                    .password(passwordEncoder.encode("admin123"))
                    .name("Admin")
                    .role("ADMIN")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());
        }
        ensureAdminUserExists();
    }

    /** Updates product.reviewCount and product.rating from actual reviews in DB. */
    private void updateProductReviewStats(Product product) {
        List<Review> list = reviewRepository.findByProductIdOrderByReviewDateDesc(product.getId());
        int count = list.size();
        double avg = list.isEmpty() ? 0.0
                : list.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setReviewCount(count);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        if (product.getImages() != null) {
            product.setImages(new java.util.ArrayList<>(product.getImages()));
        }
        productRepository.save(product);
    }

    /** Ensures admin user exists (e.g. when DB was seeded before admin was added, or admin was deleted). */
    private void ensureAdminUserExists() {
        if (userRepository.findByEmail("admin@soil2spoon.com").isPresent()) {
            return;
        }
        Instant now = Instant.now();
        userRepository.save(User.builder()
                .email("admin@soil2spoon.com")
                .password(passwordEncoder.encode("admin123"))
                .name("Admin")
                .role("ADMIN")
                .createdAt(now)
                .updatedAt(now)
                .build());
    }
}
