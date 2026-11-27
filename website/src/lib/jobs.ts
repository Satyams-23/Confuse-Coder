// IT job list for /r/jobs (Instagram "JOBS" DM link). JOB DROP series on @confuse__coder.dev.
// Rules: official link wherever possible, every entry has posted / last date / last checked.
// Remove an entry as soon as its link is dead or its last date has passed. Update UPDATED on every change.

export const UPDATED = "27 Nov 2026";

export type Job = {
  company: string;
  role: string;
  where: string;
  exp: string;
  pay?: string;
  posted?: string; // "20 Nov"
  lastDate?: string; // real deadline, e.g. "14 Dec 2026"; omit = rolling
  status?: "confirmed" | "reported";
  note?: string;
  url: string;
  via: string; // site the link opens
};

// Exams, drives and campus programmes (freshers / 0-2 yrs)
export const DRIVES: Job[] = [
  {
    company: "Infosys",
    role: "Off-campus: Specialist Programmer L1–L3 / Digital Specialist Engineer",
    where: "In-person test + interview at Infosys centres",
    exp: "2024, 2025, 2026 batch · BE/BTech/ME/MTech/MCA/MSc (5-yr)",
    pay: "SP L3 ₹21 LPA · L2 ₹16 LPA · L1 ₹10 LPA + ₹1L bonus · DSE ₹6.25 LPA + ₹75K bonus",
    posted: "Nov 2026",
    lastDate: "30 Nov 2026",
    status: "confirmed",
    note: "3-hour in-person coding test. Not eligible if you took any Infosys / Infosys BPM selection process on or after 10 Sep 2026, or work at Infosys now.",
    url: "https://surveys.infosysapps.com/r/a/DECSPDSEoffcampusregistration",
    via: "surveys.infosysapps.com",
  },
  {
    company: "TCS",
    role: "TCS iON NQT (December test)",
    where: "Online / test centres",
    exp: "Final year + freshers",
    lastDate: "14 Dec 2026",
    status: "confirmed",
    note: "Test date 25 Dec 2026. The November test (24 Nov) registration closed on 12 Nov.",
    url: "https://www.tcsion.com/hub/national-qualifier-test/",
    via: "tcsion.com",
  },
  {
    company: "TCS",
    role: "CodeVita Season 14",
    where: "Online coding contest",
    exp: "Students",
    status: "confirmed",
    note: "Registration open on the TCS entry-level careers page. Top performers get interview calls.",
    url: "https://www.tcs.com/careers/india/entry-level",
    via: "tcs.com",
  },
  {
    company: "Infosys",
    role: "Graduate hiring (Systems Engineer)",
    where: "India",
    exp: "Freshers · 2027 batch reported",
    status: "reported",
    note: "Infosys hired ~8,000 freshers in Jul–Sep 2026, FY27 target 20,000.",
    url: "https://www.infosys.com/careers/graduates.html",
    via: "infosys.com",
  },
  {
    company: "Cognizant",
    role: "GenC / entry-level roles",
    where: "India",
    exp: "Freshers · 2027 batch reported",
    status: "reported",
    url: "https://careers.cognizant.com/india-en/",
    via: "careers.cognizant.com",
  },
  {
    company: "Accenture",
    role: "Associate Software Engineer (early career)",
    where: "India",
    exp: "Freshers",
    status: "confirmed",
    note: "Hires all year (rolling), no fixed season.",
    url: "https://www.accenture.com/in-en/careers/life-at-accenture/entry-level",
    via: "accenture.com",
  },
  {
    company: "HCLTech",
    role: "Careers (freshers + experienced)",
    where: "India",
    exp: "All levels",
    note: "6,136 freshers joined in Jul–Sep 2026; plans 10–11k this year.",
    url: "https://careers.hcltech.com/",
    via: "careers.hcltech.com",
  },
  {
    company: "Wipro",
    role: "Careers (Elite NLTH for freshers)",
    where: "India",
    exp: "Freshers",
    url: "https://careers.wipro.com/",
    via: "careers.wipro.com",
  },
];

// Live fresher openings (0–2 yrs welcome). Naukri listings: open, then use "Apply on company site" when shown.
export const FRESHER: Job[] = [
  {company: "Zycus", role: "Software Engineer - Graduates 2026", where: "Mumbai", exp: "2026 batch · BE/BTech", posted: "25 Nov", url: "https://www.naukri.com/job-listings-software-engineer-graduates-2026-zycus-infotech-pvt-ltd-mumbai-0-to-1-years-251126504131", via: "naukri.com"},
  {company: "Aon", role: "Associate Software Engineer", where: "Gurugram", exp: "0–1 yrs", posted: "25 Nov", url: "https://www.naukri.com/job-listings-associate-software-engineer-aon-gurugram-0-to-1-years-251126504599", via: "naukri.com"},
  {company: "Bristlecone", role: "Associate Software Engineer", where: "Pune", exp: "0–2 yrs", posted: "26 Nov", url: "https://www.naukri.com/job-listings-associate-software-engineer-bristlecone-pune-0-to-2-years-261126507501", via: "naukri.com"},
  {company: "Optum", role: "Software Engineer - Java Full Stack", where: "Hyderabad", exp: "0–3 yrs", posted: "26 Nov", url: "https://www.naukri.com/job-listings-software-engineer-java-full-stack-angular-kafka-ci-cd-optum-global-solutions-india-private-limited-hyderabad-0-to-3-years-261126939671", via: "naukri.com"},
  {company: "Barclays", role: "Software Engineer - AI", where: "Pune", exp: "0–7 yrs", posted: "26 Nov", url: "https://www.naukri.com/job-listings-software-engineer-ai-barclays-shared-services-pune-0-to-7-years-261126503928", via: "naukri.com"},
  {company: "Harman", role: "Software Engineer - GitLab CI/CD", where: "Bengaluru", exp: "0–6 yrs", posted: "26 Nov", url: "https://www.naukri.com/job-listings-software-engineer-gitlab-ci-cd-harman-india-kalyani-bengaluru-0-to-6-years-261126502986", via: "naukri.com"},
  {company: "Capgemini", role: "Software Engineer", where: "Pune", exp: "0–5 yrs", posted: "26 Nov", url: "https://www.naukri.com/job-listings-software-engineer-capgemini-technology-services-india-limited-pune-0-to-5-years-261126911538", via: "naukri.com"},
  {company: "Barclays", role: "Software Engineer - AI", where: "Pune", exp: "0–5 yrs", posted: "21 Nov", url: "https://www.naukri.com/job-listings-software-engineer-ai-barclays-shared-services-pune-0-to-5-years-201126500118", via: "naukri.com"},
  {company: "Qualcomm", role: "Software Engineer", where: "Bengaluru", exp: "0–1 yrs", pay: "₹17–32 LPA", posted: "~1 Nov", url: "https://www.naukri.com/job-listings-software-engineer-qualcomm-bengaluru-0-to-1-years-261026005898", via: "naukri.com"},
  {company: "Qualcomm", role: "Software Engineer", where: "Hyderabad", exp: "0–1 yrs", pay: "₹15–25 LPA", posted: "~8 Nov", url: "https://www.naukri.com/job-listings-software-engineer-qualcomm-hyderabad-0-to-1-years-061026002836", via: "naukri.com"},
  {company: "Cognizant", role: "Artificial Intelligence Engineer", where: "Hyderabad", exp: "0 yrs", posted: "18 Nov", url: "https://www.naukri.com/job-listings-artificial-intelligence-engineer-cognizant-hyderabad-0-to-0-years-171126019969", via: "naukri.com"},
  {company: "Capgemini", role: "Software Engineer", where: "Bengaluru", exp: "0–5 yrs", posted: "19 Nov", url: "https://www.naukri.com/job-listings-software-engineer-capgemini-technology-services-india-limited-bengaluru-0-to-5-years-181126927080", via: "naukri.com"},
  {company: "Capgemini", role: "Software Engineer", where: "Hyderabad", exp: "0–5 yrs", posted: "19 Nov", url: "https://www.naukri.com/job-listings-software-engineer-capgemini-technology-services-india-limited-hyderabad-0-to-5-years-181126927679", via: "naukri.com"},
  {company: "Caterpillar", role: "Software Engineer", where: "Chennai", exp: "0–9 yrs", posted: "21 Nov", url: "https://www.naukri.com/job-listings-software-engineer-caterpillar-brazil-chennai-0-to-9-years-211126502849", via: "naukri.com"},
  {company: "Compleren AI Labs", role: "Artificial Intelligence Engineer", where: "Bengaluru (Whitefield)", exp: "0–6 yrs", pay: "₹12–14.4 LPA", posted: "21 Nov", url: "https://www.naukri.com/job-listings-artificial-intelligence-engineer-compleren-ai-labs-bengaluru-0-to-6-years-131126032572", via: "naukri.com"},
];

// Experienced (2+ yrs). Amazon links are amazon.jobs (official).
export const EXPERIENCED: Job[] = [
  {company: "Amazon", role: "Software Development Engineer", where: "Hyderabad", exp: "4+ yrs", posted: "25 Nov", url: "https://www.amazon.jobs/en/jobs/10613775/software-development-engineer", via: "amazon.jobs"},
  {company: "Amazon", role: "Software Development Engineer II", where: "Bengaluru", exp: "3+ yrs", posted: "24 Nov", url: "https://www.amazon.jobs/en/jobs/10613545/software-development-engineer-ii", via: "amazon.jobs"},
  {company: "Amazon", role: "SDE II (Android/iOS), Last Mile Platform Services", where: "Gurugram", exp: "3+ yrs", posted: "24 Nov", url: "https://www.amazon.jobs/en/jobs/10612630/software-development-engineer-ii-android-ios-last-mile-platform-services-sde", via: "amazon.jobs"},
  {company: "Amazon", role: "SDE, PaySec StoreSec", where: "Bengaluru", exp: "3+ yrs", posted: "23 Nov", url: "https://www.amazon.jobs/en/jobs/10610382/software-development-engineer-paysec-storesec", via: "amazon.jobs"},
  {company: "Amazon", role: "SDE II, Grocery In-store", where: "Bengaluru", exp: "3+ yrs", posted: "23 Nov", url: "https://www.amazon.jobs/en/jobs/10611480/software-development-engineer-ii-grocery-in-store", via: "amazon.jobs"},
  {company: "Amazon", role: "Software Development Engineer", where: "Hyderabad", exp: "3+ yrs", posted: "20 Nov", url: "https://www.amazon.jobs/en/jobs/10610616/software-development-engineer", via: "amazon.jobs"},
  {company: "Amazon", role: "SDE II, AWS IoT Fleet Management", where: "Bengaluru", exp: "2+ yrs", posted: "19 Nov", url: "https://www.amazon.jobs/en/jobs/10608895/software-development-engineer-ii-aws-iot-fleet-management", via: "amazon.jobs"},
  {company: "Amazon", role: "SDE II, FAI Asset Creation Technology", where: "Hyderabad", exp: "3+ yrs", posted: "19 Nov", url: "https://www.amazon.jobs/en/jobs/10609505/software-development-engineer-ii-fai-asset-creation-technology-fact", via: "amazon.jobs"},
  {company: "Amazon", role: "SDE II, Edge Intelli", where: "Bengaluru", exp: "3+ yrs", posted: "18 Nov", url: "https://www.amazon.jobs/en/jobs/10607819/software-development-engineer-ii-edge-intelli", via: "amazon.jobs"},
  {company: "Amazon", role: "Software Development Engineer, ASA", where: "Bengaluru", exp: "3+ yrs", posted: "18 Nov", url: "https://www.amazon.jobs/en/jobs/10606051/software-development-engineer-asa", via: "amazon.jobs"},
  {company: "Cisco", role: "Software Engineer", where: "Bengaluru", exp: "3–8 yrs", posted: "22 Nov", url: "https://www.naukri.com/job-listings-software-engineer-cisco-bengaluru-3-to-8-years-211126504692", via: "naukri.com"},
  {company: "Infosys", role: "Generative AI Engineer", where: "Pune · Chennai · Bengaluru (hybrid)", exp: "2–5 yrs", posted: "19 Nov", url: "https://www.naukri.com/job-listings-generative-ai-engineer-infosys-pune-chennai-bengaluru-2-to-5-years-221026035352", via: "naukri.com"},
  {company: "Capgemini", role: "Vertex AI Engineer", where: "Gurugram", exp: "2–5 yrs", posted: "21 Nov", url: "https://www.naukri.com/job-listings-vertex-ai-engineer-capgemini-technology-services-india-limited-gurugram-2-to-5-years-261026921797", via: "naukri.com"},
  {company: "Accenture", role: "Custom Software Engineer", where: "Pune", exp: "3–8 yrs", posted: "21 Nov", url: "https://www.naukri.com/job-listings-custom-software-engineer-accenture-solutions-pvt-ltd-pune-3-to-8-years-201126917154", via: "naukri.com"},
  {company: "EaseMyTrip", role: "Generative AI Engineer", where: "Gurugram", exp: "1–4 yrs", pay: "₹8–18 LPA", posted: "21 Nov", url: "https://www.naukri.com/job-listings-generative-ai-engineer-easemytrip-com-gurugram-1-to-4-years-120525010837", via: "naukri.com"},
  {company: "Bajaj Finance", role: "Software Engineer", where: "Pune", exp: "2–5 yrs", posted: "20 Nov", url: "https://www.naukri.com/job-listings-software-engineer-bajaj-finance-limited-pune-2-to-5-years-191126929960", via: "naukri.com"},
];

// Official career search pages (always fresh)
export const CAREER_PAGES: {name: string; url: string; via: string}[] = [
  {name: "Amazon · SDE roles in India", url: "https://www.amazon.jobs/en/search?base_query=software+development+engineer&loc_query=India", via: "amazon.jobs"},
  {name: "Microsoft · Software Engineer, India", url: "https://jobs.careers.microsoft.com/global/en/search?q=software%20engineer&lc=India", via: "careers.microsoft.com"},
  {name: "Google · Software Engineer, India", url: "https://www.google.com/about/careers/applications/jobs/results/?location=India&q=software%20engineer", via: "google.com/about/careers"},
  {name: "Qualcomm · India", url: "https://careers.qualcomm.com/careers?location=India", via: "careers.qualcomm.com"},
  {name: "Barclays · India", url: "https://search.jobs.barclays/search-jobs/India", via: "search.jobs.barclays"},
];

// One-tap searches (filters already set) so the list never goes stale
export const SEARCHES: {name: string; url: string; via: string}[] = [
  {name: "Software Engineer · fresher · last 7 days", url: "https://www.naukri.com/software-engineer-jobs?experience=0&jobAge=7", via: "naukri.com"},
  {name: "AI Engineer · fresher · last 7 days", url: "https://www.naukri.com/ai-engineer-jobs?experience=0&jobAge=7", via: "naukri.com"},
  {name: "Software Engineer · fresher · 15–25 lakh", url: "https://www.naukri.com/software-engineer-jobs?experience=0&ctcFilter=15to25", via: "naukri.com"},
  {name: "AI Engineer · 3 yrs · last 3 days", url: "https://www.naukri.com/ai-engineer-jobs?experience=3&jobAge=3", via: "naukri.com"},
  {name: "Generative AI · 3 yrs", url: "https://www.naukri.com/generative-ai-jobs?experience=3", via: "naukri.com"},
  {name: "LinkedIn · Software Engineer · entry level · past week", url: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=India&f_E=1%2C2&f_TPR=r604800", via: "linkedin.com"},
];
