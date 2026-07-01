import dotenv from "dotenv";
import pg from "pg";
import { createHash } from "crypto";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Clear existing data
    await client.query("DELETE FROM placements");
    await client.query("DELETE FROM faculty");
    await client.query("DELETE FROM courses");
    await client.query("DELETE FROM news");
    await client.query("DELETE FROM admins");

    // ── ADMIN ──────────────────────────────────────────────────────────────
    const secret = process.env.SESSION_SECRET || "dev-secret";
    const hash = createHash("sha256").update("admin123" + secret).digest("hex");
    await client.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
      ["admin", hash]
    );
    console.log("✓ Admin seeded");

    // ── COURSES ────────────────────────────────────────────────────────────
    const courses = [
       {
    name: "Bachelor of Business Administration (BBA)",
    department: "Management Studies",
    type: "UG",
    duration: "3 Years",
    seats: 120,
    description:
      "The BBA program at Indrayani Mahavidyalaya is designed to develop future business professionals and entrepreneurs. The curriculum covers marketing, finance, human resources, business communication, entrepreneurship, and organizational management. Through practical learning, industry interactions, projects, and skill development activities, students gain the knowledge and confidence required for successful careers in the corporate world.",
    eligibility:
      "Passed 10+2 or equivalent examination from a recognized board as per university norms.",
    fees: "As per university and government norms.",
    is_active: true,
  },
  {
    name: "Bachelor of Computer Applications (BCA)",
    department: "Computer Applications",
    type: "UG",
    duration: "3 Years",
    seats: 120,
    description:
      "The BCA program at Indrayani Mahavidyalaya provides a strong foundation in computer science, software development, programming, databases, networking, and emerging technologies. Students gain practical experience through laboratory sessions, projects, and industry-oriented learning, preparing them for careers in software development, IT services, and technology-driven organizations.",
    eligibility:
      "Passed 10+2 or equivalent examination from a recognized board as per university norms.",
    fees: "As per university and government norms.",
    is_active: true,
  },
  {
    name: "Master of Business Administration (MBA)",
    department: "Management Studies",
    type: "PG",
    duration: "2 Years",
    seats: 120,
    description:
      "The MBA program at Indrayani Mahavidyalaya is designed to prepare future leaders and managers through advanced studies in marketing, finance, human resources, operations, business analytics, and strategic management. The program emphasizes leadership development, decision-making skills, industry exposure, internships, and real-world business applications.",
    eligibility:
      "Bachelor's degree from a recognized university. Admission as per State CET Cell / university guidelines.",
    fees: "As per government and university norms.",
    is_active: true,
  },
  {
    name: "Master of Computer Applications (MCA)",
    department: "Computer Applications",
    type: "PG",
    duration: "2 Years",
    seats: 120,
    description:
      "The MCA program at Indrayani Mahavidyalaya focuses on advanced computing, software engineering, data structures, database management, cloud computing, artificial intelligence, and application development. The curriculum combines theoretical knowledge with practical implementation to prepare students for leadership roles in the IT industry and technology sector.",
    eligibility:
      "Bachelor's degree with Mathematics at 10+2 or graduation level. Admission as per State CET Cell / university guidelines.",
    fees: "As per government and university norms.",
    is_active: true,
  },
    ];

    for (const c of courses) {
      await client.query(
        `INSERT INTO courses (name, department, type, duration, seats, description, eligibility, fees, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [c.name, c.department, c.type, c.duration, c.seats, c.description, c.eligibility, c.fees, c.is_active]
      );
    }
    console.log("✓ 4 courses seeded");

    // ── FACULTY ────────────────────────────────────────────────────────────
    const faculty = [
      {
        name: "Prof. (Dr.) S. N. Patil",
        department: "Electrical & Electronics Engineering",
        designation: "Principal",
        qualification: "Ph.D.",
        specialization: "Electrical and Electronics Engineering",
        experience: 26,
        is_hod: false,
        bio: "Principal of Yashoda Mahadeo Kakade College of Engineering with 25 years of academic and 1 year of industrial experience.",
      },
      {
        name: "Dr. Amruta Surana",
        department: "Computer Science & Engineering",
        designation: "Vice Principal & Associate Professor",
        qualification: "Ph.D. (Computer Engineering), Post Doctoral Researcher at NKUST China, M.B.A. (Pursuing)",
        specialization: "Computer Engineering",
        experience: 15,
        is_hod: true,
        bio: "Post Doctoral Researcher at NKUST China with expertise in computer engineering. Serves as Vice Principal and HOD of Computer Engineering.",
      },
      {
        name: "Prof. Sushama Nawale",
        department: "Computer Science & Engineering",
        designation: "Assistant Professor",
        qualification: "M.E. (Computer Engineering), Ph.D. (Pursuing)",
        specialization: "Computer Engineering",
        experience: 6,
        is_hod: false,
        bio: "Pursuing Ph.D. with 6 years of teaching experience in Computer Engineering.",
      },
      {
        name: "Mr. Mahesh Pawar",
        department: "Mechanical Engineering",
        designation: "Assistant Professor",
        qualification: "M.E. (Mechanical Design), Ph.D. (Pursuing)",
        specialization: "Mechanical Design",
        experience: 14,
        is_hod: true,
        bio: "14 years of teaching experience in Mechanical Engineering with specialization in Design Engineering.",
      },
      {
        name: "Mr. Amol Kharat",
        department: "Mechanical Engineering",
        designation: "Assistant Professor",
        qualification: "M.E. (Mechanical – Heat Power)",
        specialization: "Heat Power Engineering",
        experience: 14,
        is_hod: false,
        bio: "14 years of teaching experience in Mechanical Engineering with specialization in Heat Power.",
      },
      {
        name: "Mr. Santosh Namdeo Karle",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.Tech. (Industrial Mathematics), Ph.D. (Pursuing), SET/NET",
        specialization: "Industrial Mathematics",
        experience: 12,
        is_hod: true,
        bio: "12 years of teaching experience. CEO and SET/NET qualified with expertise in Industrial Mathematics.",
      },
      {
        name: "Mr. Vishal Chaugule",
        department: "Civil Engineering",
        designation: "Assistant Professor",
        qualification: "M.Tech. (Structural Engineering, VIT Chennai), Ph.D. (Pursuing)",
        specialization: "Structural Engineering",
        experience: 9,
        is_hod: true,
        bio: "M.Tech. from VIT Chennai with 9 years of teaching experience in Civil / Structural Engineering.",
      },
      {
        name: "Mrs. Vrushali Satyajit Patil",
        department: "Civil Engineering",
        designation: "Assistant Professor",
        qualification: "M.E. Civil (Environment Engineering), Ph.D. (Pursuing)",
        specialization: "Environmental Engineering",
        experience: 6,
        is_hod: false,
        bio: "6 years of teaching experience in Civil Engineering with specialization in Environmental Engineering.",
      },
      {
        name: "Ms. Ahilya Vishnu Narsale",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.Sc. (Mathematics), B.Ed.",
        specialization: "Mathematics",
        experience: 9,
        is_hod: false,
        bio: "9 years of teaching experience in Mathematics.",
      },
      {
        name: "Mr. Pritam Nandakumar Mule",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.Sc. (Analytical Chemistry), B.Ed., Ph.D. (Pursuing)",
        specialization: "Analytical Chemistry, Material Characterization",
        experience: 4,
        is_hod: false,
        bio: "Expertise in material characterization (nanomaterials, polymers, alloys), quality control & standardization, and data interpretation.",
      },
      {
        name: "Dr. Chetan M. Harak",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "Ph.D., M.Sc. (Organic Chemistry), SET, NET",
        specialization: "Organic Chemistry",
        experience: 13,
        is_hod: false,
        bio: "13 years of teaching experience. Ph.D. qualified with SET and NET in Chemistry.",
      },
      {
        name: "Ms. Sheetal Shivaji Hotkar",
        department: "Electronics & Telecommunication Engineering",
        designation: "Assistant Professor",
        qualification: "M.E. (VLSI & Embedded Systems), B.E. (ENTC), Ph.D. (Pursuing)",
        specialization: "VLSI & Embedded Systems",
        experience: 13,
        is_hod: true,
        bio: "13 years of teaching experience in ENTC with specialization in VLSI and Embedded Systems.",
      },
      {
        name: "Prof. Trupti Shinde",
        department: "Training & Placement",
        designation: "Assistant Professor & Soft Skills Trainer",
        qualification: "M.B.A., Ph.D. (Pursuing)",
        specialization: "Soft Skills, Career Development",
        experience: 6,
        is_hod: false,
        bio: "6 years of experience as TPO and Soft Skills Trainer, guiding students for industry readiness.",
      },
      {
        name: "Mr. Sandeep D. Walunj",
        department: "Library",
        designation: "Librarian",
        qualification: "M.Lib. & I.Sc., B.A., SET",
        specialization: "Library & Information Science",
        experience: 11,
        is_hod: false,
        bio: "11 years of experience as a Library professional. SET qualified.",
      },
      {
        name: "Ms. Sheetal Machhindra Autade",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.A. (English)",
        specialization: "English Language & Communication",
        experience: null,
        is_hod: false,
        bio: "Teaches English and Communication Skills to engineering students.",
      },
      {
        name: "Ms. Priyanka Tukaram Rokade",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.A. (English)",
        specialization: "English Language & Communication",
        experience: null,
        is_hod: false,
        bio: "Teaches English and Communication Skills to engineering students.",
      },
      {
        name: "Ms. Jyoti Avinash Kshirsagar",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.A. (English)",
        specialization: "English Language & Communication",
        experience: null,
        is_hod: false,
        bio: "Teaches English and Communication Skills to engineering students.",
      },
      {
        name: "Ms. Manasi Rahul Chavan",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.Sc. (Mathematics)",
        specialization: "Mathematics",
        experience: null,
        is_hod: false,
        bio: "Teaches Engineering Mathematics and Applied Mathematics.",
      },
      {
        name: "Dr. Vishal Mangesh Kamathe",
        department: "Basic Sciences & Humanities",
        designation: "Assistant Professor",
        qualification: "M.Sc. (Physics)",
        specialization: "Applied Physics",
        experience: 7,
        is_hod: false,
        bio: "7 years of teaching experience in Applied Physics for engineering students.",
      },
    ];

    for (const f of faculty) {
      await client.query(
        `INSERT INTO faculty (name, department, designation, qualification, specialization, experience, is_hod, bio)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [f.name, f.department, f.designation, f.qualification, f.specialization, f.experience, f.is_hod, f.bio]
      );
    }
    console.log("✓ 19 faculty seeded");

    // ── NEWS ───────────────────────────────────────────────────────────────
    const news = [
      {
        title: "Admissions Open for B.Tech 2026-27",
        content:
          "Yashoda Mahadeo Kakade College of Engineering invites applications for B.Tech admissions for the academic year 2026-27. Programs available: Computer Science & Engineering (120 seats), Artificial Intelligence & Data Science (120 seats), Electronics & Telecommunication Engineering (60 seats), and Information Technology (60 seats). Affiliated to Dr. Babasaheb Ambedkar Technological University, AICTE Approved. Apply online at indrayaniedu.in/home/admission/ymk_coe",
        category: "announcement",
        published_at: new Date("2026-05-01"),
        is_pinned: true,
      },
      {
        title: "Job Fair 2026 Successfully Conducted at Indrayani Mahavidyalaya",
        content:
          "A Job Fair was successfully conducted at Yashoda Mahadeo Kakade College of Engineering on 26th March 2026, aimed at facilitating job opportunities for students from Indrayani Mahavidyalaya and nearby institutions under Indrayani Vidya Mandir. The event served as a valuable platform connecting aspiring candidates with prospective employers. The fair witnessed enthusiastic participation from students across multiple disciplines, with several companies offering on-the-spot interviews and placement opportunities. Hon. MP Shrirang Barne graced the event and encouraged youth to explore self-employment and entrepreneurship.",
        category: "event",
        published_at: new Date("2026-03-26"),
        is_pinned: true,
      },
      {
        title: "Final Merit List 2025-26 Published",
        content:
          "The final merit list for B.Tech admissions for the academic year 2025-26 has been published. Candidates are requested to download the merit list from the college website and report for document verification as per the schedule. For details regarding vacant seats, refer to the Admission Schedule & Vacant Seats document available on the college website.",
        category: "announcement",
        published_at: new Date("2025-10-15"),
        is_pinned: false,
      },
      {
        title: "Institution Innovation Cell Activities 2024-25",
        content:
          "The Institution Innovation Cell (IIC) at Indrayani Mahavidyalaya successfully conducted several workshops, hackathons, and innovation boot camps during 2024-25. Students from all departments participated in design thinking sessions, prototype development, and startup ideation workshops. The IIC aims to foster a culture of innovation and entrepreneurship among students.",
        category: "achievement",
        published_at: new Date("2025-04-10"),
        is_pinned: false,
      },
      {
        title: "MoU Signed with Industry Partners for Skill Development",
        content:
          "Yashoda Mahadeo Kakade College of Engineering has signed Memoranda of Understanding (MoU) with leading industry partners to enhance skill development opportunities for students. These collaborations include internship programs, guest lectures by industry experts, and access to cutting-edge tools and technologies.",
        category: "news",
        published_at: new Date("2025-03-01"),
        is_pinned: false,
      },
      {
        title: "Indrayani Mahavidyalaya Students Excel in University Examinations",
        content:
          "Students of Yashoda Mahadeo Kakade College of Engineering have performed exceptionally well in the Dr. Babasaheb Ambedkar Technological University examinations. Several students have secured distinction and first-class results across all four B.Tech programs. The college congratulates the achievers and thanks the dedicated faculty for their guidance.",
        category: "achievement",
        published_at: new Date("2025-01-20"),
        is_pinned: false,
      },
      {
        title: "Girls' Hostel Facilities Upgraded for 2025-26",
        content:
          "The management of Indrayani Vidya Mandir is pleased to announce major upgrades to the Girls' Hostel facilities at Indrayani Mahavidyalaya campus, Talegaon Dabhade. New amenities include 24/7 Wi-Fi, improved mess facilities, CCTV surveillance, and dedicated study rooms. Applications for hostel accommodation for the academic year 2025-26 are now open.",
        category: "announcement",
        published_at: new Date("2024-11-05"),
        is_pinned: false,
      },
    ];

    for (const n of news) {
      await client.query(
        `INSERT INTO news (title, content, category, published_at, is_pinned)
         VALUES ($1,$2,$3,$4,$5)`,
        [n.title, n.content, n.category, n.published_at, n.is_pinned]
      );
    }
    console.log("✓ 7 news items seeded");

    // ── PLACEMENTS ─────────────────────────────────────────────────────────
    const placements = [
      {
        student_name: "Rahul Deshmukh",
        company: "TCS",
        package: "3.5 LPA",
        role: "Systems Engineer",
        department: "Computer Science & Engineering",
        year: 2025,
        testimonial:
          "Indrayani Mahavidyalaya gave me the technical and soft skills foundation I needed to crack the TCS placement drive.",
      },
      {
        student_name: "Priya Jadhav",
        company: "Infosys",
        package: "3.6 LPA",
        role: "Systems Engineer",
        department: "Computer Science & Engineering",
        year: 2025,
        testimonial:
          "The training sessions by Prof. Trupti Shinde were incredibly helpful for interview preparation.",
      },
      {
        student_name: "Akash Patil",
        company: "Wipro",
        package: "3.5 LPA",
        role: "Project Engineer",
        department: "Information Technology",
        year: 2025,
        testimonial:
          "The practical lab sessions at Indrayani Mahavidyalaya prepared me well for real-world software projects.",
      },
      {
        student_name: "Sneha Kulkarni",
        company: "Cognizant",
        package: "4.0 LPA",
        role: "Programmer Analyst",
        department: "Computer Science & Engineering",
        year: 2025,
        testimonial:
          "I'm grateful to the placement cell and faculty who mentored me throughout the process.",
      },
      {
        student_name: "Omkar Shinde",
        company: "Tech Mahindra",
        package: "3.8 LPA",
        role: "Associate Software Engineer",
        department: "Artificial Intelligence & Data Science",
        year: 2025,
        testimonial:
          "The AI curriculum at Indrayani Mahavidyalaya aligned perfectly with what Tech Mahindra was looking for.",
      },
      {
        student_name: "Neha Bhosale",
        company: "HCL Technologies",
        package: "3.5 LPA",
        role: "Graduate Engineer Trainee",
        department: "Electronics & Telecommunication Engineering",
        year: 2025,
        testimonial:
          "Hands-on labs in VLSI and embedded systems gave me a real edge in the placement interviews.",
      },
      {
        student_name: "Vikas More",
        company: "L&T Technology Services",
        package: "4.5 LPA",
        role: "Engineering Trainee",
        department: "Electronics & Telecommunication Engineering",
        year: 2024,
        testimonial: "Indrayani Mahavidyalaya's industry-focused curriculum made the transition to professional work seamless.",
      },
      {
        student_name: "Rutuja Pawar",
        company: "Persistent Systems",
        package: "4.0 LPA",
        role: "Software Developer",
        department: "Information Technology",
        year: 2024,
        testimonial: "The coding culture at Indrayani Mahavidyalaya and support from faculty helped me land my dream job.",
      },
      {
        student_name: "Gaurav Kamble",
        company: "Capgemini",
        package: "4.0 LPA",
        role: "Analyst",
        department: "Computer Science & Engineering",
        year: 2024,
        testimonial: "The placement preparation workshops were excellent — they covered both technical and HR rounds.",
      },
      {
        student_name: "Ankita Gaikwad",
        company: "Mphasis",
        package: "3.75 LPA",
        role: "Junior Developer",
        department: "Artificial Intelligence & Data Science",
        year: 2024,
        testimonial: "AI & DS at Indrayani Mahavidyalaya opened doors I never imagined. The Python and ML labs were world-class.",
      },
      {
        student_name: "Sanket Thorat",
        company: "Accenture",
        package: "4.5 LPA",
        role: "Application Development Associate",
        department: "Computer Science & Engineering",
        year: 2024,
        testimonial: "Great exposure through internships and college projects helped me ace the Accenture interviews.",
      },
      {
        student_name: "Pooja Wagh",
        company: "Zensar Technologies",
        package: "3.6 LPA",
        role: "Software Trainee",
        department: "Information Technology",
        year: 2023,
        testimonial: "Indrayani Mahavidyalaya taught me to think like an engineer and solve problems efficiently.",
      },
      {
        student_name: "Abhijit Salunkhe",
        company: "KPIT Technologies",
        package: "5.0 LPA",
        role: "Embedded Software Engineer",
        department: "Electronics & Telecommunication Engineering",
        year: 2023,
        testimonial: "KPIT was looking for embedded systems expertise — exactly what Indrayani Mahavidyalaya trained me in.",
      },
      {
        student_name: "Komal Sonawane",
        company: "Bajaj Auto",
        package: "4.2 LPA",
        role: "Graduate Engineer Trainee",
        department: "Mechanical Engineering",
        year: 2023,
        testimonial: "Mechanical labs and design projects at Indrayani Mahavidyalaya prepared me well for the automotive sector.",
      },
    ];

    for (const p of placements) {
      await client.query(
        `INSERT INTO placements (student_name, company, package, role, department, year, testimonial)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [p.student_name, p.company, p.package, p.role, p.department, p.year, p.testimonial]
      );
    }
    console.log("✓ 14 placements seeded");

    await client.query("COMMIT");
    console.log("\n✅ Database seeded successfully with real Indrayani Mahavidyalaya data!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
