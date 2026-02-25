package com.soil2spoon.service;

import com.soil2spoon.dto.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serves static content for FAQs, shipping/returns policies, contact info, and site information.
 * Can be extended later to load from database or configuration.
 */
@Service
public class ContentService {

    public List<FaqResponse> getFaqs() {
        return List.of(
                FaqResponse.builder()
                        .id("shipping")
                        .question("What are the delivery charges?")
                        .answer("We offer free shipping on all orders over ₹499. For orders below that, a flat delivery charge of ₹49 applies. Delivery usually takes 3–5 business days within India.")
                        .build(),
                FaqResponse.builder()
                        .id("returns")
                        .question("What is your return and refund policy?")
                        .answer("You may return unopened products in their original packaging within 7 days of delivery for a full refund. Opened food items cannot be returned for hygiene reasons. Contact support@soil2spoon.com to initiate a return.")
                        .build(),
                FaqResponse.builder()
                        .id("shelf-life")
                        .question("How should I store the products and how long do they last?")
                        .answer("Store pastes and chutneys in the refrigerator after opening; keep spices and powders in a cool, dry place away from direct sunlight. Shelf life is mentioned on each product label—typically 180 days for pastes (after opening, use within 4–6 weeks) and up to 12 months for dry spices and powders.")
                        .build(),
                FaqResponse.builder()
                        .id("ingredients")
                        .question("Are your products vegetarian?")
                        .answer("Yes. All Soil2Spoon products are vegetarian. Check the product Highlights and Ingredients on each product page for full details.")
                        .build(),
                FaqResponse.builder()
                        .id("orders")
                        .question("How can I track my order?")
                        .answer("Once your order is shipped, you will receive an email with a tracking link. You can also log in to your account and view order status under Dashboard. For any issues, reach out to support@soil2spoon.com.")
                        .build(),
                FaqResponse.builder()
                        .id("payment")
                        .question("What payment methods do you accept?")
                        .answer("We accept all major credit and debit cards, UPI, net banking, and select digital wallets. Payment is processed securely at checkout.")
                        .build()
        );
    }

    public ShippingPolicyResponse getShippingPolicy() {
        return ShippingPolicyResponse.builder()
                .title("Shipping policy")
                .intro("We deliver across India. Here is what you need to know.")
                .freeOver(499)
                .flatCharge(49)
                .deliveryDays("3–5 business days")
                .zones(List.of(
                        ShippingZoneResponse.builder().name("Metro cities").days("2–3 business days").build(),
                        ShippingZoneResponse.builder().name("Rest of India").days("4–5 business days").build()
                ))
                .note("Orders placed before 2:00 PM IST on a business day are typically dispatched the same day. You will receive an email with tracking details once your order is shipped.")
                .build();
    }

    public ReturnsPolicyResponse getReturnsPolicy() {
        return ReturnsPolicyResponse.builder()
                .title("Returns & refunds")
                .intro("We want you to be happy with your purchase. Here's our returns policy.")
                .windowDays(7)
                .conditions(List.of(
                        "Product must be unopened and in original packaging.",
                        "Opened food items cannot be returned for hygiene reasons.",
                        "To initiate a return, contact us at support@soil2spoon.com with your order number and reason.",
                        "Refunds are processed within 5–7 business days after we receive the returned product."
                ))
                .contactNote("For any return or refund queries, reach out to support@soil2spoon.com or use our Contact page.")
                .build();
    }

    public ContactInfoResponse getContactInfo() {
        return ContactInfoResponse.builder()
                .email("support@soil2spoon.com")
                .phone("+91 98765 43210")
                .address("123 Spice Lane, Andheri East, Mumbai, Maharashtra 400069")
                .hours("Mon–Sat: 9:00 AM – 6:00 PM IST")
                .build();
    }

    /**
     * Returns default site/product information. Optional productId can be used later for per-product overrides.
     */
    public SiteInformationResponse getSiteInformation(String productId) {
        return SiteInformationResponse.builder()
                .disclaimer("All images are for representational purposes only. It is advised that you read the batch and manufacturing details, directions for use, allergen information, health and nutritional claims (wherever applicable), and other details mentioned on the label before consuming the product. For combo items, individual prices can be viewed on the page.")
                .customerCareDetails("In case of any issue, contact us\nE-mail address: support@zeptonow.com")
                .sellerName("Geddit Convenience Private Limited")
                .sellerAddress("Geddit Convenience Private Limited, Unit 803, Lodha Supremus, Saki Vihar Road, Opp MTNL, Office, Powai, Mumbai, Maharashtra, India, 400072. For Support ReachOut: support+geddit@zeptonow.com")
                .sellerLicenseNo("11521998000248")
                .manufacturerName("Connedit Business Solutions Private Limited")
                .countryOfOrigin("India")
                .shelfLife("180 days")
                .build();
    }
}
