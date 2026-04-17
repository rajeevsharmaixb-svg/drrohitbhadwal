# Dr Rohit Dental Clinic Braces & Implant Centre Website

## 1. Project Overview
**Project Name:** Dr Rohit Dental Clinic Website
**Clinic Name:** Dr Rohit Dental Clinic Braces & Implant Centre
**Established:** 2011

**Purpose:** Build a modern, fast, mobile-friendly clinic website that helps patients explore services, understand the clinic, and book appointments through a simple and smooth experience.
**Primary Goal:** Increase appointment bookings while keeping the website easy to use on mobile, tablet, and desktop.

## 2. Clinic Information
**Doctors**
*   **Dr Rohit Bhadwal** — Dental Surgeon, Implantologist
*   **Dr Ankita Pawar** — Dental Surgeon, Esthetic Dentist
*   **Dr Rishabh Gupta** — Orthodontist

**Contact**
*   **Phone / WhatsApp:** +91 90184 64914
*   **Location:** 9GFF+Q72 Shaheedi Smarak, CHOWK, College Rd, Urliwand, Kathua, Jammu and Kashmir 184101
*   **Consultation Fee:** Approx. ₹200 (Editable by admin)
*   **Tagline:** “Creating Confident Smiles with Advanced Dental Care”

## 3. Product Vision
The website should feel professional, premium, smooth, simple, trustworthy, and easy to use on a phone. The hero section should be strong and visually clear, with direct actions for booking and WhatsApp contact.

## 4. User Roles
### 4.1 Public Visitor
Can view the website, read about the clinic, see doctors, view services, use AI chat support, and contact through WhatsApp. A visitor cannot book an appointment without login.
### 4.2 Registered Patient
Can sign up / log in, book appointments, choose services or packages, select a doctor, track booking status, and receive confirmations and reminders.
### 4.3 Admin
Can manage all clinic content, doctors, appointments, packages, services, FAQs, website settings, track performance and bookings, and view user and appointment data.

## 5. Website Goals
*   Make the website easy to understand.
*   Make booking smooth and fast.
*   Make WhatsApp contact direct and visible.
*   Make the admin dashboard powerful but simple.
*   Make the design modern and premium.
*   Ensure strong security and data protection.

## 6. Main Website Sections
### 6.1 Hero Section
Clinic name, short tagline, short clinic introduction. CTA buttons: Book Appointment, WhatsApp Contact, View Services.
### 6.2 About Section
Clinic history (since 2011), patient-friendly care, modern dental care center, painless treatment approach, hygienic and comfortable environment, skilled staff, advanced equipment.
### 6.3 Doctors Section
Doctor photo, full name, qualification, specialization, short description, availability if needed.
### 6.4 Services Section
Show top services on the homepage, then a full services page for complete details.
### 6.5 Packages Section
Normal treatment options, full treatment packages, package price, included services, doctor or treatment category if needed.
### 6.6 Testimonials Section
Patient reviews and ratings to build trust.
### 6.7 Location Section
Clinic address, map embed, directions button.
### 6.8 Contact Section
Phone, WhatsApp button, optional email, clinic timings.

## 7. Services List
*   **General Dentistry:** Dental check-up & consultation, Tooth cleaning & polishing, Fillings, Preventive dental care, Tooth-colored fillings
*   **Root Canal Treatment (RCT):** Single sitting RCT, Re-RCT, Post & core build-up, Crown placement after RCT
*   **Orthodontics / Braces:** Metal braces, Ceramic braces, Self-ligating braces, Teeth alignment, Smile correction, Space closure
*   **Dental Implants:** Single tooth implant, Multiple implants, Full mouth implants, Immediate loading implants, Implant-supported crowns and bridges
*   **Prosthodontics:** Fixed crowns and bridges, Zirconia crowns, Complete dentures, Flexible dentures
*   **Cosmetic Dentistry:** Teeth whitening, Smile designing, Veneers and laminates, Diastema / gap closure
*   **Oral & Maxillofacial Surgery:** Tooth extraction, Surgical extraction, Wisdom tooth removal, Cyst removal, Minor oral surgeries
*   **Pediatric Dentistry:** Child dental care, Fluoride therapy, Pit and fissure sealants, Space maintainers
*   **Gum Treatment:** Deep cleaning, Scaling and root planing, Gum surgery, Bleeding gums treatment, Gum depigmentation
*   **Advanced & Specialized Treatments:** Full mouth rehabilitation, Laser dentistry, Digital dental X-rays, TMJ treatment, Bruxism management, Mouth ulcer treatment, Oral cancer screening
*   **Emergency Dental Care:** Toothache relief, Broken tooth repair, Trauma management, Swelling and infection treatment

## 8. Appointment Booking System
**Booking Rules:** Public visitors can browse, but booking requires login. Short and simple. Prevent double booking.
**Booking Flow:** User selects service/package > User selects doctor > User chooses date > User chooses time slot > User enters details > User confirms booking.
**Required Fields:** Name, Phone number, Age. (Optional: Email)
**Time Selection:** Morning shift (10:00 AM – 2:00 PM), Evening shift (4:30 PM – 7:30 PM).

## 9. AI Chatbot
Answer common questions, explain services, suggest relevant treatment options, guide users to booking, redirect to WhatsApp if needed, answer timing and contact questions.

## 10. WhatsApp Integration
A floating WhatsApp button available on all pages. Direct contact, one-click opening, pre-filled message, visible on mobile and desktop.

## 11. Login and Signup
Booking requires login. Optional Future Upgrade: OTP-based quick login, saved patient profile, booking history.

## 12. Admin Dashboard
### 12.1 Appointment Management
View all appointments, filter by date/doctor/service/status, confirm/cancel/reschedule/mark completed, track no-shows.
*Status Types:* New, Pending, Confirmed, Rescheduled, Completed, Cancelled, No Show.
### 12.2 Patient Data Management
View patient name, phone, age, email, appointment history, selected service/package, doctor assigned.
### 12.3 Website Content Management
Edit homepage hero, about, contact, timings, consultation fee, map, testimonials, FAQ.
### 12.4 Services Management
Add/edit/delete/toggle services.
### 12.5 Package Management
Add/edit/toggle treatment packages, update included treatments and prices.
### 12.6 Doctors Management
Add/edit/delete, upload photo, update qualifications/specialization/experience. Assign doctor to appointments.
### 12.7 AI Chatbot Management
Edit FAQs, update suggestions, map symptoms.
### 12.8 Performance Tracking
Track appointments booked, visits, top services, package conversion, WhatsApp clicks.
### 12.9 Audit Log
Record admin activity (who edited what).

## 13. Security Requirements
The system should be designed to minimize the risk of data leakage through secure backend handling, encrypted storage where applicable, role-based access control, and restricted admin permissions.

## 14. Backend and Database (Supabase)
Recommended Tables: `users`, `appointments`, `doctors`, `services`, `packages`, `site_settings` (clinic_settings), `faq`, `testimonials`, `admin_logs`.

## 15-21. UI, UX, Performance, Extras
Mobile-first, premium look, WhatsApp floating button, fast, optional Google Maps embed.
