import { Component } from '@angular/core';
import { Header } from "./header/header";
import { HeroSection } from "./hero-section/hero-section";
import { FeaturesSection } from "./features-section/features-section";
import { PricingSection } from "./pricing-section/pricing-section";
import { TestimonialsSection } from "./testimonials-section/testimonials-section";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-landing-page',
  imports: [Header, HeroSection, FeaturesSection, PricingSection, TestimonialsSection, Footer],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
