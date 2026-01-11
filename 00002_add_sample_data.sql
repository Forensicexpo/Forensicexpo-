-- Insert sample events
INSERT INTO public.events (title, description, start_date, end_date, location, status, registration_deadline, max_attendees) VALUES
('International Forensic Science Conference 2026', 'Join leading forensic scientists from around the world for three days of cutting-edge research presentations, workshops, and networking opportunities. This premier conference will cover the latest developments in DNA analysis, digital forensics, toxicology, and crime scene investigation.', '2026-06-15', '2026-06-17', 'London, United Kingdom', 'upcoming', '2026-06-01', 500),
('Advanced DNA Analysis Workshop', 'A hands-on workshop focusing on the latest techniques in DNA analysis and interpretation. Participants will learn about next-generation sequencing, mixture interpretation, and statistical analysis of DNA evidence. Limited seats available.', '2026-04-20', '2026-04-22', 'Washington DC, USA', 'upcoming', '2026-04-10', 50),
('Digital Forensics Summit', 'Explore the evolving landscape of digital forensics including mobile device forensics, cloud forensics, and cryptocurrency investigations. Expert speakers will share real-world case studies and emerging technologies in the field.', '2026-08-10', '2026-08-12', 'Singapore', 'upcoming', '2026-07-25', 300),
('Forensic Toxicology Symposium', 'An in-depth symposium on forensic toxicology covering drug testing methodologies, interpretation of toxicological findings, and emerging substances of abuse. Ideal for forensic scientists, pathologists, and law enforcement professionals.', '2026-09-05', '2026-09-07', 'Sydney, Australia', 'upcoming', '2026-08-20', 200);

-- Insert sample news
INSERT INTO public.news (title, content, excerpt, published, published_at) VALUES
('New DNA Analysis Technology Revolutionizes Forensic Science', 'Researchers have developed a groundbreaking DNA analysis technology that can process samples 10 times faster than current methods while maintaining accuracy. This advancement is expected to significantly reduce case backlogs in forensic laboratories worldwide.

The new technology, developed through a collaboration between leading universities and forensic science institutes, uses advanced microfluidics and machine learning algorithms to automate much of the DNA analysis process. Early trials have shown remarkable success rates, with the technology able to generate profiles from degraded samples that were previously considered unusable.

Dr. Sarah Mitchell, lead researcher on the project, stated: "This technology represents a paradigm shift in forensic DNA analysis. We can now process samples that would have taken weeks in just a few days, without compromising on accuracy or reliability."

The technology is expected to be available to forensic laboratories within the next 18 months, pending regulatory approval. Several major law enforcement agencies have already expressed interest in adopting the system.', 'Revolutionary DNA technology promises to transform forensic laboratories with 10x faster processing times.', true, '2026-01-05'),

('Forensic Expo Organisation Announces 2026 Conference Schedule', 'We are excited to announce our comprehensive schedule of forensic science events for 2026. This year''s program includes four major conferences and workshops covering DNA analysis, digital forensics, toxicology, and crime scene investigation.

Our flagship International Forensic Science Conference will take place in London from June 15-17, bringing together over 500 forensic professionals from around the world. The conference will feature keynote presentations from leading experts, hands-on workshops, and extensive networking opportunities.

Registration is now open for all events. Early bird discounts are available for registrations completed before March 31, 2026. We look forward to welcoming you to our events and contributing to the advancement of forensic science.', 'Complete schedule of 2026 forensic science events now available with early bird registration discounts.', true, '2026-01-08'),

('Digital Forensics: Addressing New Challenges in Cryptocurrency Investigations', 'As cryptocurrency adoption continues to grow, forensic investigators face new challenges in tracing digital assets and investigating crypto-related crimes. Our upcoming Digital Forensics Summit will address these challenges with expert presentations and practical workshops.

The summit will cover blockchain analysis techniques, cryptocurrency wallet forensics, and methods for tracking transactions across multiple platforms. Attendees will learn from experienced investigators who have successfully worked on high-profile cryptocurrency cases.

Key topics include:
- Blockchain analysis and transaction tracing
- Cryptocurrency wallet recovery and analysis
- Dark web investigations
- Legal considerations in crypto forensics
- Tools and techniques for crypto investigations

The Digital Forensics Summit is scheduled for August 10-12, 2026, in Singapore. Registration is now open.', 'Upcoming summit to address growing challenges in cryptocurrency forensics and blockchain investigations.', true, '2026-01-09');