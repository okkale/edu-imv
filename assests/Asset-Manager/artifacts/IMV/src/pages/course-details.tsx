import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useRoute, Link } from "wouter";
import { useGetFaculty } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Clock,
  Users,
  BookOpen,
  ChevronLeft,
  Target,
  Eye,
  Calendar,
  Award,
  BookMarked,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "@/components/ui/terminal";
import CourseGraph from "@/components/ui/course-graph";
import SecurityTerminalEntry from "@/components/ui/SecurityTerminalEntry";

// Types
interface Subject {
  code: string;
  name: string;
  type: "CORE" | "LAB" | "AUDIT" | "PROJECT";
  credits: number;
  hours: number;
  description: string;
  modules?: string[];
}

interface SemesterData {
  num: number;
  name: string;
  credits: number;
  description: string;
  subjects: Subject[];
}

interface YearData {
  yearName: string;
  shortName: string; // e.g. "1st Year", "2nd Year"
  label: string; // e.g. "FIRST YEAR (FY)", "SECOND YEAR (SY)"
  semesters: SemesterData[];
}

interface CourseInfo {
  name: string;
  shortName: string;
  duration: string;
  intake: number;
  choiceCode: string;
  choiceCodeTfws: string;
  dbDeptName: string;
  summary: string;
  vision: string;
  mission: string[];
  programOutcomes?: string[];
  years: YearData[];
  calendar: {
    event: string;
    dates: string;
    type: "Academic" | "Exam" | "Co-curricular";
  }[];
}

// BBA, BCA, MBA, MCA Syllabus & Course Configuration
const COURSE_DATA: Record<string, CourseInfo> = {
  "bca": {
    name: "Bachelor of Computer Applications (BCA)",
    shortName: "BCA",
    duration: "3 Years",
    intake: 120,
    choiceCode: "1617399510",
    choiceCodeTfws: "1617399511T",
    dbDeptName: "Computer Applications",
    summary: "The BCA program provides a strong foundation in computer applications, programming language logic, database design, software engineering methodologies, web technology frameworks, and networking architectures. Aligned with Savitribai Phule Pune University (SPPU), it prepares students for careers in software development, cloud systems administration, and data intelligence services.",
    vision: "To be a recognized center of excellence in computer applications, nurturing technically proficient, innovative, and ethically accountable IT professionals to fulfill global industry demands.",
    mission: [
      "To impart conceptual and hands-on laboratory education in computer applications through experienced faculty and advanced Computing labs.",
      "To foster design thinking, software engineering skills, and system logic through project-oriented assignments and certification paths.",
      "To inculcate collaborative working habits, technical communication excellence, and professional ethics for sustainable career progress."
    ],
    programOutcomes: [
      "Scientific Knowledge - Apply the knowledge of mathematics, science fundamentals, and specialization to the solution of complex problems.",
      "Problem analysis - Identify, formulate, review research literature, and analyze complex problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and sciences.",
      "Design/development of solutions - Design solutions for complex problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.",
      "Conduct investigations of complex problems - Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.",
      "Modern tool usage - Create, select, and apply appropriate techniques, resources, and modern IT tools including prediction and modelling to complex activities with an understanding of the limitations.",
      "The Graduate and society - Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional practice.",
      "Environment and sustainability - Understand the impact of the professional solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.",
      "Ethics - Apply ethical principles and commit to professional ethics and responsibilities and norms of the professional practice.",
      "Individual and team work - Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.",
      "Communication - Communicate effectively on complex activities with the professional community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
      "Project management and finance - Demonstrate knowledge and understanding of the science and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.",
      "Life-long learning - Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change."
    ],
    years: [
      {
        yearName: "1st Year",
        shortName: "1st Year",
        label: "FIRST YEAR (FY)",
        semesters: [
          {
            num: 1,
            name: "Semester I",
            credits: 22,
            description: "Introduces fundamental concepts of computer architectures, problem solving in C, discrete structures, and web design basics.",
            subjects: [
              { code: "CA-101-T", name: "Problem Solving and Programming in C", type: "CORE", credits: 2, hours: 2, description: "Flowcharts, algorithms, C data types, expressions, control flow, functions, and arrays.", modules: ["Unit 1: Problem Solving & Algorithms", "Unit 2: C Fundamentals & Operators", "Unit 3: Control & Iterative Structures", "Unit 4: Functions & Recursion", "Unit 5: Arrays and String Basics"] },
              { code: "CA-102-P", name: "Lab course on CA-101-T", type: "LAB", credits: 2, hours: 4, description: "Practical implementations of C programming exercises, sorting arrays, and functional algorithms.", modules: ["Assignment 1: C Data Types & Operators", "Assignment 2: Decisions & Branching", "Assignment 3: Loop Controls (while/for)", "Assignment 4: Custom User Defined Functions", "Assignment 5: Array Manipulations"] },
              { code: "CA-103-T", name: "Computer Organization & Architecture", type: "CORE", credits: 2, hours: 2, description: "Data representation, logic gates, combinational and sequential logic circuits, and CPU organization.", modules: ["Unit 1: Data representation & Arithmetic", "Unit 2: Boolean Algebra & Logic Gates", "Unit 3: Combinational Logic Circuits", "Unit 4: Sequential Logic & Registers", "Unit 5: CPU, Memory, and I/O Layouts"] },
              { code: "CA-104-P", name: "Lab course on CA-103-T", type: "LAB", credits: 2, hours: 4, description: "Practicals verifying logic gates truth tables, half/full adders, multiplexers, and counters.", modules: ["Assignment 1: Verification of Logic Gates", "Assignment 2: De-Morgan's Theorems", "Assignment 3: Half Adder and Full Adder", "Assignment 4: Multiplexers and Decoders", "Assignment 5: Shift Registers & Flip-flops"] },
              { code: "CA-105-T", name: "Discrete Mathematics and Statistics", type: "CORE", credits: 2, hours: 2, description: "Sets, relations, counting techniques, central tendency, dispersion, correlation, and sampling.", modules: ["Unit 1: Set Theory & Propositional Logic", "Unit 2: Relations & Functions", "Unit 3: Counting & Probability Concepts", "Unit 4: Data Presentation & Aggregations", "Unit 5: Correlation Theory and Sampling"] },
              { code: "CA-106-P", name: "Laboratory Course on CA-105-T", type: "LAB", credits: 2, hours: 4, description: "Performing mathematical logic verification and data analysis using R software.", modules: ["Assignment 1: Applied Mathematics Labs", "Assignment 2: Download and Install R IDE", "Assignment 3: Statistical Functions in R", "Assignment 4: Import datasets & Standard Deviation", "Assignment 5: Normal Distribution in R"] },
              { code: "OE-101-CA", name: "Introduction to Data Science", type: "CORE", credits: 2, hours: 2, description: "Concepts of data science, statistics for data science, models, data quality, and data visualization.", modules: ["Unit 1: Introduction to Data Science", "Unit 2: Statistics for Data Science", "Unit 3: Data Science Models & Tasks", "Unit 4: Data Quality & Pre-processing", "Unit 5: Data Visualisation Tools"] },
              { code: "VSEC-101-CA", name: "HTML and Webpage Designing", type: "LAB", credits: 2, hours: 4, description: "Practical web designing, lists, tables, frames, forms, CSS styles, and event handling using JavaScript.", modules: ["Assignment 1: Basic HTML structures", "Assignment 2: Tables & Layout designing", "Assignment 3: Form creations & fields", "Assignment 4: Inline/External CSS styling", "Assignment 5: Event validation in JavaScript"] },
              { code: "IKS-100-T", name: "Indian Knowledge System", type: "CORE", credits: 2, hours: 2, description: "Traditional Indian scientific, mathematical, and astronomical frameworks.", modules: ["Unit 1: Introduction to IKS", "Unit 2: Traditional Indian Mathematics", "Unit 3: Astronomy and Cosmology", "Unit 4: Ecological Heritage & Governance"] },
              { code: "AEC-101-ENG", name: "English Communication Skills", type: "AUDIT", credits: 2, hours: 2, description: "Language enrichment, formal emails, group discussions, and business correspondence.", modules: ["Unit 1: Basics of Speech & Grammar", "Unit 2: Professional Resume writing", "Unit 3: Presentation Skills & Mock Interviews"] },
              { code: "VEC-101-ENV", name: "Environmental Awareness", type: "AUDIT", credits: 2, hours: 2, description: "Ecological balances, pollution guidelines, waste disposals, and sustainable green ecosystems.", modules: ["Unit 1: Natural Resources & Ecosystems", "Unit 2: Environmental Pollution & Controls", "Unit 3: Sustainability Practices"] }
            ]
          },
          {
            num: 2,
            name: "Semester II",
            credits: 22,
            description: "Builds advanced C programming skills, microcontrollers, linear algebra, and spreadsheet analytics.",
            subjects: [
              { code: "CA-151-T", name: "Advanced C Programming", type: "CORE", credits: 2, hours: 2, description: "Pointers, dynamic memory allocation, string handling, structures, unions, and file input/output.", modules: ["Unit 1: Preprocessor & Macros", "Unit 2: Pointers and Memory Management", "Unit 3: Strings & String operations", "Unit 4: Structures, typedef, and Union", "Unit 5: File Handling operations"] },
              { code: "CA-152-P", name: "Lab course on CA-151-T", type: "LAB", credits: 2, hours: 4, description: "Practicals executing file handling, advanced pointers, structures, and preprocessor directives.", modules: ["Assignment 1: Preprocessor Directives", "Assignment 2: Reference & Dereference Pointers", "Assignment 3: Dynamic Memory Allocations", "Assignment 4: Structures & Nested Structures", "Assignment 5: File input/output lab scripts"] },
              { code: "CA-153-T", name: "Introduction to Microcontrollers", type: "CORE", credits: 2, hours: 2, description: "Basics of microcontrollers, 8051 architecture, internal memory, programming, timers, and interfacing.", modules: ["Unit 1: Introduction to Microprocessors", "Unit 2: 8051 Microcontroller Architecture", "Unit 3: 8051 Assembly & C Programming", "Unit 4: Timers and Counters registers", "Unit 5: Interrupts and Interfacing peripherals"] },
              { code: "CA-154-P", name: "Lab course on CA-153-T", type: "LAB", credits: 2, hours: 4, description: "Practicals coding 8051 simulation, arithmetic, data transfer, and hardware interfacing.", modules: ["Assignment 1: Keil uVision-5 IDE Setup", "Assignment 2: Proteus Simulator configurations", "Assignment 3: Largest/Smallest values sorting", "Assignment 4: Addition/Subtraction arithmetic", "Assignment 5: Waveform generation via DAC"] },
              { code: "CA-155-T", name: "Linear Algebra", type: "CORE", credits: 2, hours: 2, description: "Systems of linear equations, rank of matrix, vector spaces, eigenvalues, and linear transformations.", modules: ["Unit 1: Systems of Linear Equations", "Unit 2: Vector Spaces - I", "Unit 3: Vector Spaces - II", "Unit 4: Eigenvalues and Eigenvectors", "Unit 5: Linear Transformations"] },
              { code: "CA-156-P", name: "Laboratory Course on CA-155-T", type: "LAB", credits: 2, hours: 4, description: "Practical computations of linear algebra operations and matrix algorithms using Scilab software.", modules: ["Assignment 1: Matrix row echelon forms", "Assignment 2: Subspaces & Basis checks", "Assignment 3: Eigenvalues & eigenvectors", "Assignment 4: Introduction to Scilab", "Assignment 5: Scilab linear equation solving"] },
              { code: "OE-151-CA", name: "Data Science Using Spreadsheet Software", type: "LAB", credits: 2, hours: 4, description: "Advanced spreadsheet modeling, formulas, charts, goal seek, lookup functions, and pivot tables.", modules: ["Assignment 1: Excel Interface & Layouts", "Assignment 2: Autocomplete & number formats", "Assignment 3: Formatting & headers/footers", "Assignment 4: Filtering and Sorting techniques", "Assignment 5: Text, Logical, and Lookup functions"] },
              { code: "VSEC-151", name: "Software Tools for Business Communication", type: "LAB", credits: 2, hours: 4, description: "Practicals with Google Suite (Docs, Sheets, Slides, Forms) and email and generative AI tools.", modules: ["Unit 1: Word processing & Google Docs", "Unit 2: Spreadsheets & Google Sheets", "Unit 3: Presentations & Google Slides", "Unit 4: Google Forms & Drive layouts", "Unit 5: Emails, Groups, & Chat GPT"] },
              { code: "AEC-151-ENG", name: "English Communication Skills II", type: "AUDIT", credits: 2, hours: 2, description: "Advanced reading comprehension, speech writing, and business presentations.", modules: ["Unit 1: Reading comprehension texts", "Unit 2: Executive speech writing", "Unit 3: Visual aid presentations"] },
              { code: "VEC-151-ENV", name: "Environmental Studies II", type: "AUDIT", credits: 2, hours: 2, description: "Climatic changes, ecosystem balances, global warming, and green audits.", modules: ["Unit 1: Climate change challenges", "Unit 2: Global warming & ozone layers", "Unit 3: Green audit frameworks"] },
              { code: "CC-151-PE", name: "Physical Education", type: "AUDIT", credits: 2, hours: 2, description: "Physical wellness, yoga practices, and basic athletic training.", modules: ["Unit 1: Yoga postures & pranayama", "Unit 2: Athletic training sessions", "Unit 3: Fitness evaluations"] }
            ]
          }
        ]
      },
      {
        yearName: "2nd Year",
        shortName: "2nd Year",
        label: "SECOND YEAR (SY)",
        semesters: [
          {
            num: 3,
            name: "Semester III",
            credits: 24,
            description: "Covers object-oriented programming in Java, Python scripting, relational databases, operating systems, and dynamic web technologies.",
            subjects: [
              { code: "CA-201-T", name: "Object Oriented Programming using Java", type: "CORE", credits: 2, hours: 2, description: "Classes, objects, inheritance, polymorphism, exception handling, file I/O, and collections in Java.", modules: ["Unit 1: Introduction to OOP & Java", "Unit 2: Classes, Objects & Methods", "Unit 3: Inheritance & Polymorphism", "Unit 4: Exception Handling & File I/O", "Unit 5: Collections Framework"] },
              { code: "CA-202-P", name: "Lab course on CA-201-T", type: "LAB", credits: 2, hours: 4, description: "Practical Java programs covering OOP concepts, exception handling and file operations.", modules: ["Assignment 1: Class and Object creation", "Assignment 2: Inheritance & Overriding", "Assignment 3: Interfaces & Abstract classes", "Assignment 4: Try-Catch & Custom Exceptions", "Assignment 5: File I/O & Serialization"] },
              { code: "CA-203-T", name: "Python Programming", type: "CORE", credits: 2, hours: 2, description: "Python syntax, data structures, file handling, modules, regular expressions, and web scraping basics.", modules: ["Unit 1: Python Basics & Data Types", "Unit 2: Control Flow & Functions", "Unit 3: Lists, Tuples, Dicts & Sets", "Unit 4: File Handling & Modules", "Unit 5: Regular Expressions & Web Scraping"] },
              { code: "CA-204-P", name: "Lab course on CA-203-T", type: "LAB", credits: 2, hours: 4, description: "Practical Python programs on data structures, file handling, and introductory web scraping.", modules: ["Assignment 1: Basic Python programs", "Assignment 2: List comprehensions & Sorting", "Assignment 3: Dictionary operations", "Assignment 4: File read/write operations", "Assignment 5: Intro to BeautifulSoup"] },
              { code: "CA-205-T", name: "Database Management Systems", type: "CORE", credits: 2, hours: 2, description: "ER modelling, relational algebra, normalization (1NF-BCNF), SQL queries, transactions, and concurrency control.", modules: ["Unit 1: Introduction to DBMS & ER model", "Unit 2: Relational Model & Algebra", "Unit 3: SQL DDL, DML & DCL", "Unit 4: Normalization & Functional Dependencies", "Unit 5: Transactions & Concurrency Control"] },
              { code: "CA-206-P", name: "Lab course on CA-205-T", type: "LAB", credits: 2, hours: 4, description: "Practical SQL queries, DDL/DML operations, stored procedures, and normalization exercises using MySQL.", modules: ["Assignment 1: DDL statements & Table creation", "Assignment 2: DML - Insert, Update, Delete", "Assignment 3: SQL Joins & Subqueries", "Assignment 4: Stored Procedures & Triggers", "Assignment 5: Normalization exercises"] },
              { code: "OE-201-CA", name: "Operating Systems", type: "CORE", credits: 2, hours: 2, description: "Process management, CPU scheduling, memory management, file systems, and I/O subsystems.", modules: ["Unit 1: OS concepts & Process Management", "Unit 2: CPU Scheduling Algorithms", "Unit 3: Memory Management & Paging", "Unit 4: File System & Directory structures", "Unit 5: I/O Systems & Deadlocks"] },
              { code: "VSEC-201-CA", name: "Web Technologies Lab", type: "LAB", credits: 2, hours: 4, description: "Dynamic web development using HTML5, CSS3, JavaScript DOM, AJAX, and JSON.", modules: ["Assignment 1: HTML5 Semantic elements", "Assignment 2: CSS3 Flexbox & Grid layouts", "Assignment 3: JavaScript DOM manipulation", "Assignment 4: AJAX & Fetch API", "Assignment 5: JSON data handling"] },
              { code: "AEC-201", name: "Communication Skills - III", type: "AUDIT", credits: 2, hours: 2, description: "Advanced business communication, technical writing, and group discussion skills.", modules: ["Unit 1: Technical Report Writing", "Unit 2: Research Paper writing", "Unit 3: Group Discussion techniques"] },
              { code: "VEC-201", name: "Values & Ethics in Profession", type: "AUDIT", credits: 2, hours: 2, description: "Professional ethics, social responsibilities, and IT industry codes of conduct.", modules: ["Unit 1: Ethics concepts & frameworks", "Unit 2: Intellectual Property Rights", "Unit 3: Cyber ethics & digital laws"] }
            ]
          },
          {
            num: 4,
            name: "Semester IV",
            credits: 24,
            description: "Explores data structures, computer networks, software engineering methodologies, and PHP web development.",
            subjects: [
              { code: "CA-251-T", name: "Data Structures using Java", type: "CORE", credits: 2, hours: 2, description: "Stacks, queues, linked lists, trees, graphs, sorting and searching algorithms using Java.", modules: ["Unit 1: Linear Data Structures - Arrays & Linked Lists", "Unit 2: Stacks & Queues in Java", "Unit 3: Trees - Binary & BST", "Unit 4: Graphs - BFS & DFS", "Unit 5: Sorting & Searching Algorithms"] },
              { code: "CA-252-P", name: "Lab course on CA-251-T", type: "LAB", credits: 2, hours: 4, description: "Implementing data structures using Java including stacks, queues, trees, and graphs.", modules: ["Assignment 1: Array operations & searching", "Assignment 2: Linked list operations", "Assignment 3: Stack & Queue using arrays", "Assignment 4: Binary search tree", "Assignment 5: Graph traversal BFS & DFS"] },
              { code: "CA-253-T", name: "Computer Networks", type: "CORE", credits: 2, hours: 2, description: "OSI and TCP/IP models, network topologies, protocols, IP addressing, subnetting, and security basics.", modules: ["Unit 1: Network topologies & OSI model", "Unit 2: Data Link Layer - Ethernet & MAC", "Unit 3: Network Layer - IP addressing & routing", "Unit 4: Transport Layer - TCP & UDP", "Unit 5: Application Layer - HTTP, DNS, SMTP"] },
              { code: "CA-254-P", name: "Lab course on CA-253-T", type: "LAB", credits: 2, hours: 4, description: "Practicals with network commands, Wireshark packet analysis, and basic socket programming.", modules: ["Assignment 1: IP configuration & ping commands", "Assignment 2: Subnet calculations", "Assignment 3: Wireshark packet analysis", "Assignment 4: Socket programming in Java", "Assignment 5: Simple client-server application"] },
              { code: "CA-255-T", name: "Software Engineering", type: "CORE", credits: 2, hours: 2, description: "SDLC models, requirements engineering, software design using UML, testing strategies, and project management.", modules: ["Unit 1: SDLC models - Waterfall & Agile", "Unit 2: Requirements Engineering & SRS", "Unit 3: Software Design - UML diagrams", "Unit 4: Software Testing methodologies", "Unit 5: Software Project Management"] },
              { code: "CA-256-P", name: "Lab course on CA-255-T", type: "LAB", credits: 2, hours: 4, description: "Creating UML diagrams (use case, class, sequence), SRS documents, and test plans.", modules: ["Assignment 1: Use case diagram creation", "Assignment 2: Class diagram design", "Assignment 3: Sequence diagram", "Assignment 4: SRS document writing", "Assignment 5: Test case design"] },
              { code: "OE-251-CA", name: "PHP & MySQL Web Development", type: "LAB", credits: 2, hours: 4, description: "Server-side scripting with PHP, MySQL database connectivity, form validation, sessions, and cookies.", modules: ["Assignment 1: PHP syntax & forms", "Assignment 2: MySQL connectivity & CRUD", "Assignment 3: Session & Cookie management", "Assignment 4: File upload & validation", "Assignment 5: Dynamic website project"] },
              { code: "VSEC-251", name: "e-Commerce Fundamentals", type: "CORE", credits: 2, hours: 2, description: "E-commerce models, payment gateways, online marketing, digital transactions, and security issues.", modules: ["Unit 1: E-commerce models & frameworks", "Unit 2: Payment systems & security", "Unit 3: Digital marketing & SEO", "Unit 4: Legal aspects of e-commerce"] },
              { code: "AEC-251", name: "Professional English - IV", type: "AUDIT", credits: 2, hours: 2, description: "Professional email drafting, technical presentations, and interview preparation.", modules: ["Unit 1: Professional email writing", "Unit 2: Interview preparation techniques", "Unit 3: Technical documentation"] },
              { code: "CC-251-PE", name: "Physical Education - II", type: "AUDIT", credits: 2, hours: 2, description: "Advanced physical fitness, sport specialization, and wellness programs.", modules: ["Unit 1: Sport specialization training", "Unit 2: Physical fitness assessments", "Unit 3: Wellness & mental health"] }
            ]
          }
        ]
      },
      {
        yearName: "3rd Year",
        shortName: "3rd Year",
        label: "THIRD YEAR (TY)",
        semesters: [
          {
            num: 5,
            name: "Semester V",
            credits: 24,
            description: "Advanced studies in modern web frameworks, machine learning, cloud computing, and mini project development.",
            subjects: [
              { code: "CA-301-T", name: "Advanced Web Technologies", type: "CORE", credits: 3, hours: 3, description: "Modern JavaScript frameworks (Node.js, React), REST APIs, JSON Web Tokens, and application deployment.", modules: ["Unit 1: Node.js & NPM ecosystem", "Unit 2: React components & hooks", "Unit 3: REST API design patterns", "Unit 4: Authentication - JWT & OAuth", "Unit 5: Deployment & CI/CD basics"] },
              { code: "CA-302-P", name: "Lab on CA-301-T", type: "LAB", credits: 2, hours: 4, description: "Building full-stack React + Node.js applications with REST API integration.", modules: ["Assignment 1: Node.js server setup", "Assignment 2: React app creation", "Assignment 3: REST API consumption", "Assignment 4: JWT authentication", "Assignment 5: Full-stack mini project"] },
              { code: "CA-303-T", name: "Machine Learning & Data Analytics", type: "CORE", credits: 3, hours: 3, description: "Supervised and unsupervised learning, regression, classification, clustering, and model evaluation using Python.", modules: ["Unit 1: Introduction to ML & Python libraries", "Unit 2: Supervised Learning - Regression", "Unit 3: Classification - Decision Trees & SVM", "Unit 4: Unsupervised Learning - Clustering", "Unit 5: Model evaluation & cross-validation"] },
              { code: "CA-304-P", name: "Lab on CA-303-T", type: "LAB", credits: 2, hours: 4, description: "Implementing ML algorithms using scikit-learn, data preprocessing and model visualization.", modules: ["Assignment 1: Pandas data preprocessing", "Assignment 2: Linear & Logistic Regression", "Assignment 3: Decision Tree classification", "Assignment 4: K-Means clustering", "Assignment 5: ML model evaluation"] },
              { code: "CA-305-T", name: "Cloud Computing", type: "CORE", credits: 3, hours: 3, description: "Cloud service models (IaaS, PaaS, SaaS), AWS/Azure fundamentals, virtualization, and cloud security.", modules: ["Unit 1: Cloud Computing concepts & models", "Unit 2: AWS fundamentals & services", "Unit 3: Virtualization & containers (Docker)", "Unit 4: Cloud storage & databases", "Unit 5: Cloud security & compliance"] },
              { code: "CA-306-P", name: "Lab on CA-305-T", type: "LAB", credits: 2, hours: 4, description: "Hands-on AWS/Azure setup, deploying web applications, and Docker containerization.", modules: ["Assignment 1: AWS EC2 instance setup", "Assignment 2: S3 storage operations", "Assignment 3: Docker container creation", "Assignment 4: Cloud web app deployment", "Assignment 5: Cloud cost optimization"] },
              { code: "CA-307P", name: "Mini Project Lab", type: "PROJECT", credits: 4, hours: 8, description: "Developing a working software project using learned technologies with full documentation and presentation.", modules: ["Phase 1: Project proposal & planning", "Phase 2: System design & architecture", "Phase 3: Implementation & coding", "Phase 4: Testing & bug fixing", "Phase 5: Project presentation & documentation"] },
              { code: "AEC-301", name: "Professional Development", type: "AUDIT", credits: 2, hours: 2, description: "Aptitude training, coding interview preparation, and career counseling sessions.", modules: ["Unit 1: Aptitude & logical reasoning", "Unit 2: Technical interview preparation", "Unit 3: Career planning & resume building"] },
              { code: "VEC-301", name: "Entrepreneurship Development", type: "CORE", credits: 2, hours: 2, description: "Startup ecosystem, idea validation, business plan preparation, and funding mechanisms.", modules: ["Unit 1: Entrepreneurship concepts & traits", "Unit 2: Idea generation & validation", "Unit 3: Business plan writing", "Unit 4: Startup funding & incubation"] }
            ]
          },
          {
            num: 6,
            name: "Semester VI",
            credits: 22,
            description: "Major project execution, cybersecurity fundamentals, IoT concepts, and industry internship evaluation.",
            subjects: [
              { code: "CA-351-T", name: "Cyber Security & Information Assurance", type: "CORE", credits: 3, hours: 3, description: "Cryptography, network security protocols, ethical hacking concepts, digital forensics, and security compliance.", modules: ["Unit 1: Information Security concepts", "Unit 2: Cryptography & encryption", "Unit 3: Network Security & firewalls", "Unit 4: Ethical hacking basics", "Unit 5: Digital forensics & compliance"] },
              { code: "CA-352-P", name: "Lab on CA-351-T", type: "LAB", credits: 2, hours: 4, description: "Practicing encryption algorithms, network scanning tools, and basic ethical hacking exercises.", modules: ["Assignment 1: Symmetric encryption (AES)", "Assignment 2: Asymmetric encryption (RSA)", "Assignment 3: Network scanning with Nmap", "Assignment 4: Password cracking analysis", "Assignment 5: Security audit checklist"] },
              { code: "CA-353-T", name: "Internet of Things (IoT)", type: "CORE", credits: 3, hours: 3, description: "IoT architecture, sensors, protocols (MQTT, CoAP), Raspberry Pi/Arduino programming, and IoT applications.", modules: ["Unit 1: IoT architecture & ecosystem", "Unit 2: Sensors & actuators", "Unit 3: Communication protocols - MQTT", "Unit 4: Arduino/Raspberry Pi programming", "Unit 5: IoT applications & challenges"] },
              { code: "CA-354-P", name: "Lab on CA-353-T", type: "LAB", credits: 2, hours: 4, description: "Building IoT prototypes with sensors, Arduino programming, and MQTT message broker setup.", modules: ["Assignment 1: Arduino LED & sensor circuits", "Assignment 2: Temperature sensor reading", "Assignment 3: MQTT broker setup", "Assignment 4: Smart home automation prototype", "Assignment 5: IoT project demonstration"] },
              { code: "CA-355P", name: "Major Project & Viva-Voce", type: "PROJECT", credits: 10, hours: 20, description: "Final year project implementation, technical report writing, and external viva-voce evaluation.", modules: ["Phase 1: Final project execution", "Phase 2: Documentation & testing", "Phase 3: Internal review presentation", "Phase 4: External viva-voce", "Phase 5: Project report submission"] },
              { code: "AEC-351", name: "Industry Internship Report", type: "AUDIT", credits: 2, hours: 4, description: "6-week industry internship, work report, and presentation before panel of faculty members.", modules: ["Unit 1: Internship work documentation", "Unit 2: Internship report writing", "Unit 3: Internship presentation & viva"] }
            ]
          }
        ]
      }
    ],
    calendar: [
      { event: "Commencement of Classes", dates: "July 15, 2026", type: "Academic" },
      { event: "First Internal Assessment (Unit Test I)", dates: "August 24 - 28, 2026", type: "Exam" },
      { event: "National Level IT Fest (Techno-Vision)", dates: "September 11 - 12, 2026", type: "Co-curricular" },
      { event: "Second Internal Assessment (Unit Test II)", dates: "October 05 - 09, 2026", type: "Exam" },
      { event: "University Practical & Oral Examinations", dates: "October 26 - November 05, 2026", type: "Exam" },
      { event: "University Theory Semester Examinations", dates: "November 18 - December 05, 2026", type: "Exam" }
    ]
  },
  "bba": {
    name: "Bachelor of Business Administration (BBA)",
    shortName: "BBA",
    duration: "3 Years",
    intake: 180,
    choiceCode: "1617324210",
    choiceCodeTfws: "1617324211T",
    dbDeptName: "Management Studies",
    summary: "The BBA program focuses on business administration fundamentals, financial management, retail, human resource operations, market logistics, and strategic entrepreneurship. Designed under SPPU guidelines, it fosters critical thinking, business modeling, and communications.",
    vision: "To cultivate business leaders, administrators, and entrepreneurs with a global management outlook, value-oriented ethics, and business agility.",
    mission: [
      "To provide high-quality business management training through real-world case analysis, corporate interactions, and internships.",
      "To develop critical analytical thinking and leadership skills through workshops and student research assignments.",
      "To encourage a mindset of social responsibility and sustainable business operations in BBA graduates."
    ],
    programOutcomes: [
      "Fundamental Business Principles - Graduates will have a thorough understanding of fundamental business principles, including management, finance, marketing, and human resources.",
      "Business Problem Solving - Graduates will be able to analyze business problems, develop strategic plans, and make data-driven decisions to address complex business challenges.",
      "Practical Application - Graduates will demonstrate the ability to apply theoretical knowledge to practical situations through hands-on projects, internships, and real-world case studies.",
      "Communication Skills - Graduates will possess strong written and verbal communication skills, essential for business reporting, presentations, and professional interactions.",
      "Teamwork and Leadership - Graduates will exhibit leadership qualities and the ability to work effectively in teams, contributing to collaborative efforts and leading projects.",
      "Modern Business Technologies - Graduates will be adept at using modern business technologies and information systems, enhancing business operations and decision-making processes.",
      "Ethical Standards - Graduates will understand and uphold ethical standards in business practices, demonstrating a commitment to corporate social responsibility and environmental sustainability.",
      "Multidisciplinary Integration - Graduates will integrate knowledge from various disciplines, providing a holistic approach to solving business problems and making informed decisions.",
      "Career Readiness - Graduates will be well-prepared for professional careers in management, finance, marketing, entrepreneurship, and other business fields, equipped with the necessary skills and knowledge.",
      "Continuous Learning - Graduates will have a commitment to continuous learning and professional development, staying current with industry trends, technological advancements, and evolving market conditions.",
      "Entrepreneurial Skills - Graduates will demonstrate entrepreneurial skills, including the ability to identify opportunities, develop business plans, and manage new ventures.",
      "Critical Thinking - Graduates will possess strong critical thinking abilities, enabling them to identify, analyze, and solve complex business problems with innovative and effective solutions."
    ],
    years: [
      {
        yearName: "1st Year",
        shortName: "1st Year",
        label: "FIRST YEAR (FY)",
        semesters: [
          {
            num: 1,
            name: "Semester I",
            credits: 22,
            description: "Covers foundational aspects of management principles, basic finance, marketing, economics, mathematics, and IT applications.",
            subjects: [
              { code: "BBA101T", name: "Principles of Management", type: "CORE", credits: 2, hours: 3, description: "Historical evolution of management thoughts, planning processes, organizing models, and control systems.", modules: ["Unit 1: Nature & Evolution of Management", "Unit 2: Planning & Decision-making process", "Unit 3: Organizing & Decentralisation basics", "Unit 4: Motivation & Control systems"] },
              { code: "BBA102FINT", name: "Principles of Finance", type: "CORE", credits: 2, hours: 3, description: "Role of financial managers, capital structure planning, time value of money, and working capital basics.", modules: ["Unit 1: Introduction to Finance & Accounting", "Unit 2: Sources of Finance & capital structures", "Unit 3: Capital Budgeting & NPV", "Unit 4: Working Capital Management"] },
              { code: "BBA102MART", name: "Principles of Marketing", type: "CORE", credits: 2, hours: 3, description: "Marketing mixes (4 Ps), consumer segmentation, targeting, positioning models, and market environments.", modules: ["Unit 1: Intro to Marketing & Markets", "Unit 2: Segmentation, Targeting, & Positioning (STP)", "Unit 3: Product & Pricing decisions", "Unit 4: Distribution & Promotion mix"] },
              { code: "BBA101HRMT", name: "Principles of Human Resource Management", type: "CORE", credits: 2, hours: 3, description: "Recruitments, training processes, performance evaluation models, and compensation planning.", modules: ["Unit 1: HRM scope & functions", "Unit 2: Job Analysis & HR Planning", "Unit 3: Recruitment, Selection, & Induction", "Unit 4: Performance Appraisal & Rewards"] },
              { code: "BBA102AGBT", name: "Agriculture and Indian Economy", type: "CORE", credits: 2, hours: 3, description: "Importance and role of agriculture in Indian economy, green revolution, credit systems, and agribusiness.", modules: ["Unit 1: Agriculture & economic development", "Unit 2: Agricultural growth & cropping patterns", "Unit 3: Agricultural Credit & NABARD", "Unit 4: Agribusiness marketing & pricing"] },
              { code: "BBA102SEMT", name: "Essentials of Services Management", type: "CORE", credits: 2, hours: 3, description: "Characteristics of service industries, service marketing mixes, and quality deliveries.", modules: ["Unit 1: Service economy & classification", "Unit 2: Service marketing mixes & 7 Ps", "Unit 3: Delivering quality services", "Unit 4: Customer satisfaction & feedback"] },
              { code: "OE-103-MTS", name: "Business Mathematics - I", type: "CORE", credits: 2, hours: 3, description: "Ratios, proportions, percentages, matrices, simple & compound interest, and fundamentals of equations.", modules: ["Unit 1: Ratios, Proportions & Percentages", "Unit 2: Simple & Compound Interest", "Unit 3: Matrices & Determinants", "Unit 4: Linear equations & models"] },
              { code: "OE-103-STS", name: "Business Statistics - I", type: "CORE", credits: 2, hours: 3, description: "Averages, deviations, correlation, regressions, and index calculations in business contexts.", modules: ["Unit 1: Measures of Central Tendency", "Unit 2: Measures of Dispersion", "Unit 3: Linear Correlation & Regression", "Unit 4: Index numbers & time-series"] },
              { code: "BBA101VSC", name: "Information Technology for Business", type: "LAB", credits: 2, hours: 3, description: "Hands-on drafting formal documents and advanced spreadsheets for analyzing business metrics.", modules: ["Lab 1: Office productivity tools", "Lab 2: Spreadsheets and Formulas", "Lab 3: Presentation layouts & transitions", "Lab 4: Database query setups"] },
              { code: "BBA101AEC", name: "Business Communication Skills - I", type: "CORE", credits: 2, hours: 3, description: "Formal business correspondence, business emails, report writing, presentation dynamics, and group communications.", modules: ["Unit 1: Communication concepts & models", "Unit 2: Business letter drafting", "Unit 3: Presentation skills", "Unit 4: Oral communication & interviews"] },
              { code: "BBA101VEC", name: "Environmental Awareness", type: "CORE", credits: 2, hours: 3, description: "Ecological balances, pollution guidelines, waste disposals, and sustainable green businesses.", modules: ["Unit 1: Natural resources & ecosystems", "Unit 2: Environmental Pollution & Controls", "Unit 3: Sustainable Development Goals"] },
              { code: "IKS-100-T", name: "Generic IKS", type: "CORE", credits: 2, hours: 3, description: "Traditional Indian scientific, mathematical, and astronomical frameworks.", modules: ["Unit 1: IKS introductions", "Unit 2: Traditional Indian Mathematics", "Unit 3: Ancient Indian Sciences"] }
            ]
          },
          {
            num: 2,
            name: "Semester II",
            credits: 22,
            description: "Introduces cost accounting, business economics, computerized accounting (Tally), and elective specializations.",
            subjects: [
              { code: "BBA201T", name: "Business Cost Accounting", type: "CORE", credits: 2, hours: 3, description: "Double-entry bookkeeping, ledger creations, trial balance, final accounts, and cost accounting concepts.", modules: ["Unit 1: Bookkeeping & Ledger setups", "Unit 2: Trial balance & Final Accounts", "Unit 3: Cost Accounting concepts & Elements", "Unit 4: Cost sheet preparation"] },
              { code: "BBA202FINT", name: "Business Accounting", type: "CORE", credits: 2, hours: 3, description: "Advanced bookkeeping, partnership accounting, and analysis of final statements.", modules: ["Unit 1: Partnership firm setups", "Unit 2: Admission, Retirement of partners", "Unit 3: Dissolution of partnerships", "Unit 4: Joint venture accounting"] },
              { code: "BBA202MART", name: "Consumer Behavior and Sales Management", type: "CORE", credits: 2, hours: 3, description: "Consumer behaviors, purchasing patterns, sales force structures, and sales territory management.", modules: ["Unit 1: Consumer behaviors & factors", "Unit 2: Purchase decision models", "Unit 3: Sales management & techniques", "Unit 4: Sales force controls & structures"] },
              { code: "BBA201HRMT", name: "Organizational Behavior", type: "CORE", credits: 2, hours: 3, description: "Individual behaviors, personality metrics, perceptual biases, group dynamics, and conflict resolutions.", modules: ["Unit 1: OB scope & models", "Unit 2: Personality, values & attitudes", "Unit 3: Group dynamics & teams", "Unit 4: Conflict & stress management"] },
              { code: "BBA202AGBT", name: "Essentials of Rural Development", type: "CORE", credits: 2, hours: 3, description: "Rural development policies, microfinance, rural industries, and cooperative societies.", modules: ["Unit 1: Rural development models", "Unit 2: Government schemes & policies", "Unit 3: Microfinance & SHGs", "Unit 4: Cooperatives & rural banking"] },
              { code: "BBA202SEMT", name: "Essentials of Services Management II", type: "CORE", credits: 2, hours: 3, description: "Service blueprinting, service quality (SERVQUAL), and customer relationship management.", modules: ["Unit 1: Service blueprint designing", "Unit 2: SERVQUAL metrics & measurements", "Unit 3: Service recovery strategies", "Unit 4: CRM in services industries"] },
              { code: "BBA203ECN", name: "Business Economics - I", type: "CORE", credits: 2, hours: 3, description: "Demand-supply mechanics, elasticity, consumer behaviors, cost analysis, and perfect/imperfect market structures.", modules: ["Unit 1: Micro economics & scarcity", "Unit 2: Demand elasticity & utility", "Unit 3: Production cost analysis", "Unit 4: Market structures (Monopoly, Oligopoly)"] },
              { code: "BBA203MTS", name: "Business Mathematics - II", type: "CORE", credits: 2, hours: 3, description: "Calculus, integrals, matrices, permutations, combinations, and probability rules.", modules: ["Unit 1: Differential Calculus & applications", "Unit 2: Permutations & Combinations", "Unit 3: Probability rules & events", "Unit 4: Matrix inversion techniques"] },
              { code: "BBA203STS", name: "Business Statistics - II", type: "CORE", credits: 2, hours: 3, description: "Hypothesis testing, chi-square, t-tests, ANOVA, and index numbers.", modules: ["Unit 1: Hypothesis testing concepts", "Unit 2: Chi-square & t-tests", "Unit 3: ANOVA testing models", "Unit 4: Index numbers & trend fitting"] },
              { code: "BBA201VSC", name: "Computerized Accounting using Tally", type: "LAB", credits: 2, hours: 5, description: "Practicals with Tally software, voucher entries, ledger setups, and profit & loss statements.", modules: ["Lab 1: Company creation in Tally", "Lab 2: Ledger setups & voucher entries", "Lab 3: Trial balance & Final Accounts", "Lab 4: GST configurations in Tally"] },
              { code: "BBA201SEC", name: "Basics of Stock Market", type: "CORE", credits: 2, hours: 3, description: "Stock market structures, NSE/BSE rules, trading mechanisms, and equity/derivative basics.", modules: ["Unit 1: Financial market structures", "Unit 2: Stock exchanges (NSE/BSE)", "Unit 3: Trading & settlement systems", "Unit 4: Equity & Mutual fund basics"] },
              { code: "BBA201AEC", name: "Business Communication Skills - II", type: "CORE", credits: 2, hours: 3, description: "Advanced correspondence, report writing, business notices, memos, and circulars.", modules: ["Unit 1: Written business communication", "Unit 2: Report writing & structure", "Unit 3: Notices, Memos & Circulars", "Unit 4: Press releases & press notes"] },
              { code: "BBA201VEC", name: "Democracy Awareness & Gender Sensitization", type: "CORE", credits: 2, hours: 3, description: "Democratic systems, constitutional rights, gender equality, and social responsibilities.", modules: ["Unit 1: Democratic values & constitution", "Unit 2: Gender issues & sensitization", "Unit 3: Social responsibilities of youth"] }
            ]
          }
        ]
      },
      {
        yearName: "2nd Year",
        shortName: "2nd Year",
        label: "SECOND YEAR (SY)",
        semesters: [
          {
            num: 3,
            name: "Semester III",
            credits: 20,
            description: "Focuses on cost accounting concepts, startup methods, and specialization pathways.",
            subjects: [
              { code: "BBA301", name: "Cost Accounting", type: "CORE", credits: 4, hours: 4, description: "Element costs, material costings, overhead allocations, and marginal cost principles." },
              { code: "BBA302", name: "Entrepreneurship Development", type: "CORE", credits: 4, hours: 4, description: "Characteristics of entrepreneurs, project drafting, startup funding options, and government incentive schemes.", modules: ["Unit 1: Concept of Entrepreneurship", "Unit 2: Entrepreneur traits & types", "Unit 3: Business opportunity identification", "Unit 4: Startup funding & government schemes"] },
              { code: "BBA303", name: "Consumer Behavior", type: "CORE", credits: 3, hours: 3, description: "Factors driving consumer purchases, decision models, and customer loyalty frameworks.", modules: ["Unit 1: Consumer behavior fundamentals", "Unit 2: Psychological factors & perception", "Unit 3: Decision making process", "Unit 4: Customer loyalty & CRM"] },
              { code: "BBA304", name: "Specialization Elective - I", type: "CORE", credits: 4, hours: 4, description: "Focused subjects in selected tracks: Marketing, Finance, or Human Resource Management.", modules: ["Unit 1: Specialization track overview", "Unit 2: Core concepts of chosen track", "Unit 3: Advanced applications", "Unit 4: Case study analysis"] },
              { code: "BBA305L", name: "Marketing/Finance/HR Lab", type: "LAB", credits: 3, hours: 6, description: "Field studies, surveys, and spreadsheet models based on selected management specialization track.", modules: ["Lab 1: Field survey design", "Lab 2: Data collection & analysis", "Lab 3: Spreadsheet financial models", "Lab 4: Presentation of findings"] },
              { code: "BBA306A", name: "Environmental Awareness", type: "AUDIT", credits: 2, hours: 2, description: "Ecological balances, pollution guidelines, waste disposals, and sustainable green businesses.", modules: ["Unit 1: Environmental management systems", "Unit 2: Green business practices", "Unit 3: Sustainability reporting"] }
            ]
          },
          {
            num: 4,
            name: "Semester IV",
            credits: 20,
            description: "Covers management accounting, operational efficiency tools, and business research.",
            subjects: [
              { code: "BBA401", name: "Management Accounting", type: "CORE", credits: 4, hours: 4, description: "Financial statement analyses, ratio diagnostics, budgetary controls, and fund flow reviews.", modules: ["Unit 1: Financial statement analysis", "Unit 2: Ratio analysis & interpretation", "Unit 3: Budgetary control systems", "Unit 4: Fund flow & cash flow analysis"] },
              { code: "BBA402", name: "Business Research Methods", type: "CORE", credits: 4, hours: 4, description: "Research methodology, sampling techniques, data gathering, hypothesis tests, and report writing.", modules: ["Unit 1: Research design & types", "Unit 2: Sampling techniques & methods", "Unit 3: Data collection instruments", "Unit 4: Hypothesis testing & report writing"] },
              { code: "BBA403", name: "Production & Operations Management", type: "CORE", credits: 3, hours: 3, description: "Plant layout design, production plans, quality control metrics, and inventory systems (JIT).", modules: ["Unit 1: Production systems & plant layout", "Unit 2: Production planning & control", "Unit 3: Quality control & TQM", "Unit 4: Inventory management & JIT"] },
              { code: "BBA404", name: "Specialization Elective - II", type: "CORE", credits: 4, hours: 4, description: "Advanced studies in chosen tracks (Marketing, Finance, or Human Resource Management).", modules: ["Unit 1: Advanced track concepts", "Unit 2: Industry analysis methods", "Unit 3: Strategic applications", "Unit 4: Project-based learning"] },
              { code: "BBA405L", name: "Research Methodology Lab", type: "LAB", credits: 3, hours: 6, description: "Conducting local surveys, data entries, hypothesis testing using statistical software, and writing research reports.", modules: ["Lab 1: Survey design & pilot testing", "Lab 2: SPSS/Excel data entry", "Lab 3: Hypothesis testing exercises", "Lab 4: Research report preparation"] }
            ]
          }
        ]
      },
      {
        yearName: "3rd Year",
        shortName: "3rd Year",
        label: "THIRD YEAR (TY)",
        semesters: [
          {
            num: 5,
            name: "Semester V",
            credits: 20,
            description: "Equips students with dynamic management outlooks, digital marketing skills, and mini project designs.",
            subjects: [
              { code: "BBA501", name: "Strategic Management", type: "CORE", credits: 4, hours: 4, description: "SWOT analyses, Porter's generic strategies, BCG matrix, mergers, and corporate policy integrations.", modules: ["Unit 1: Strategic management overview", "Unit 2: SWOT & PESTLE analysis", "Unit 3: Porter's Five Forces & generic strategies", "Unit 4: BCG matrix & corporate strategy"] },
              { code: "BBA502", name: "Digital Marketing Strategy", type: "CORE", credits: 4, hours: 4, description: "Search engine marketing, social media advertisements, email copy drafts, and Google Analytics.", modules: ["Unit 1: Digital marketing fundamentals", "Unit 2: Search Engine Optimization (SEO)", "Unit 3: Social media marketing", "Unit 4: Email campaigns & Google Analytics"] },
              { code: "BBA503", name: "Supply Chain & Logistics", type: "CORE", credits: 3, hours: 3, description: "Distribution networks, inventory cycles, material handling systems, and freight operations.", modules: ["Unit 1: Supply chain fundamentals", "Unit 2: Distribution channel management", "Unit 3: Inventory & warehouse management", "Unit 4: Transportation & freight logistics"] },
              { code: "BBA504L", name: "Digital Campaigns Lab", type: "LAB", credits: 3, hours: 6, description: "Running mock campaigns, tracking conversions, and setting up keyword optimization panels.", modules: ["Lab 1: Google Ads campaign setup", "Lab 2: Facebook/Instagram ads", "Lab 3: Keyword research & SEO audit", "Lab 4: Analytics dashboard setup"] },
              { code: "BBA505P", name: "Mini Project Lab", type: "PROJECT", credits: 6, hours: 12, description: "Writing a feasibility report for a business plan or analyzing regional industrial clusters.", modules: ["Phase 1: Business idea identification", "Phase 2: Market feasibility study", "Phase 3: Financial projections", "Phase 4: Project presentation"] }
            ]
          },
          {
            num: 6,
            name: "Semester VI",
            credits: 20,
            description: "Focuses on strategic management, governance protocols, and executing a major research report.",
            subjects: [
              { code: "BBA601", name: "Strategic Management", type: "CORE", credits: 4, hours: 4, description: "SWOT analysis, generic strategies (Porter), strategic implementation, and review frameworks.", modules: ["Unit 1: Strategic management process", "Unit 2: Strategic analysis tools", "Unit 3: Strategy formulation & selection", "Unit 4: Strategy implementation & evaluation"] },
              { code: "BBA602", name: "Corporate Governance & Ethics", type: "CORE", credits: 4, hours: 4, description: "Boardroom ethics, CSR mandates, consumer protections, and environmental codes.", modules: ["Unit 1: Corporate governance principles", "Unit 2: Board of directors & committees", "Unit 3: CSR policies & frameworks", "Unit 4: Business ethics & whistleblowing"] },
              { code: "BBA603", name: "Specialization Elective - IV", type: "CORE", credits: 4, hours: 4, description: "Final specialization module (e.g. Services Marketing, Portfolio Management, HR Development).", modules: ["Unit 1: Advanced specialization concepts", "Unit 2: Industry trends & emerging models", "Unit 3: Applied case studies", "Unit 4: Professional practice skills"] },
              { code: "BBA604P", name: "Project Report & Viva-Voce", type: "PROJECT", credits: 8, hours: 16, description: "Major survey-based industrial project report submission and face-to-face external evaluations.", modules: ["Phase 1: Project finalization & data analysis", "Phase 2: Report writing & documentation", "Phase 3: Internal review & feedback", "Phase 4: External viva-voce evaluation"] }
            ]
          }
        ]
      }
    ],
    calendar: [
      { event: "Commencement of Classes", dates: "July 15, 2026", type: "Academic" },
      { event: "First Internal Assessment (Unit Test I)", dates: "August 24 - 28, 2026", type: "Exam" },
      { event: "Young Entrepreneurs Summit (YMK-Innovate)", dates: "September 15 - 16, 2026", type: "Co-curricular" },
      { event: "Second Internal Assessment (Unit Test II)", dates: "October 05 - 09, 2026", type: "Exam" },
      { event: "Project Preliminary Submissions & Reviews", dates: "October 26 - 30, 2026", type: "Academic" },
      { event: "University Theory Semester Examinations", dates: "November 18 - December 05, 2026", type: "Exam" }
    ]
  },
  "mca": {
    name: "Master of Computer Applications (MCA)",
    shortName: "MCA",
    duration: "2 Years",
    intake: 60,
    choiceCode: "1617324610",
    choiceCodeTfws: "1617324611T",
    dbDeptName: "Computer Applications",
    summary: "The MCA program focuses on advanced computing frameworks, cloud engineering systems, large database handling, machine learning algorithms, and secure software development lifecycles. Following the modern 2-year structure, it prepares graduates for advanced software engineering and technical manager roles.",
    vision: "To lead in computing education and research, fostering advanced software engineers and tech innovators who solve industrial challenges.",
    mission: [
      "To provide deep knowledge in database management, software development, cloud systems, and AI models via advanced labs.",
      "To encourage active research, collaborative open-source contributions, and corporate technical internships.",
      "To build leaders with high ethical integrity and technical communication skills who manage global digital platforms."
    ],
    programOutcomes: [
      "Advanced Computing Knowledge - Apply advanced knowledge of computer science, software engineering, and information technology to analyze and solve complex computing problems.",
      "Problem Solving & Algorithms - Design and implement efficient algorithms and data structures to solve real-world computational problems using appropriate tools and programming paradigms.",
      "Database & Information Systems - Design, develop, and administer robust database systems and information architectures meeting enterprise-level performance and security requirements.",
      "Software Development Lifecycle - Apply systematic software engineering practices (Agile, DevOps) to develop, test, and maintain large-scale software systems from conception to deployment.",
      "Cloud & Distributed Computing - Architect, deploy, and manage cloud-based distributed systems using AWS, Azure, or GCP infrastructure and containerization technologies.",
      "Machine Learning & AI - Build and evaluate machine learning models and intelligent systems using Python, TensorFlow, or Scikit-Learn for data-driven business solutions.",
      "Cyber Security - Understand and apply cryptographic protocols, network security measures, and ethical hacking techniques to protect digital systems and infrastructure.",
      "Team Collaboration & Leadership - Function effectively as a technical lead or team member in multidisciplinary software development projects, guiding teams with agile methodologies.",
      "Professional Communication - Communicate technical concepts clearly through documentation, presentations, and reports to diverse audiences including clients and management.",
      "Ethics & Professional Responsibility - Apply professional ethics, intellectual property laws, and digital rights principles in software engineering and IT governance.",
      "Research & Innovation - Conduct applied research in emerging computing technologies, publish findings, and contribute to open-source communities and academic discourse.",
      "Lifelong Learning - Adapt to rapid technological evolution through continuous learning, certification pursuits, and engagement with cutting-edge computing frameworks."
    ],
    years: [
      {
        yearName: "1st Year",
        shortName: "1st Year",
        label: "FIRST YEAR (FY)",
        semesters: [
          {
            num: 1,
            name: "Semester I",
            credits: 24,
            description: "Builds foundations in advanced data structures, database engines, networking, and Java development.",
            subjects: [
              { code: "MCA101", name: "Advanced Java Programming", type: "CORE", credits: 4, hours: 4, description: "Servlets, JSP, Hibernate, Spring Framework, and enterprise Java application development." },
              { code: "MCA102", name: "Advanced Database Management", type: "CORE", credits: 4, hours: 4, description: "NoSQL databases, distributed database design, transaction management, and Query Tuning." },
              { code: "MCA103", name: "Advanced Data Structures & Algorithms", type: "CORE", credits: 4, hours: 4, description: "Red-Black Trees, Graph Algorithms, Dynamic Programming, and complexity analysis (NP-Hard)." },
              { code: "MCA104", name: "Mathematical Foundations & Stats", type: "CORE", credits: 3, hours: 3, description: "Discrete structures, probability distributions, matrix computations, and statistical models." },
              { code: "MCA105L", name: "Enterprise Java & DBMS Lab", type: "LAB", credits: 5, hours: 10, description: "Practical creation of enterprise applications using Spring Boot and relational/NoSQL connections." },
              { code: "MCA106L", name: "Algorithms & DS Lab", type: "LAB", credits: 4, hours: 8, description: "Implementing dynamic programming models and complex graph traversal algorithms." }
            ]
          },
          {
            num: 2,
            name: "Semester II",
            credits: 24,
            description: "Covers Python programming, modern web frameworks, operating systems, and machine learning foundations.",
            subjects: [
              { code: "MCA201", name: "Python for Machine Learning", type: "CORE", credits: 4, hours: 4, description: "Scikit-Learn, Pandas, NumPy, and algorithms for Regression, SVM, Decision Trees, and Clustering." },
              { code: "MCA202", name: "Modern Web Technologies", type: "CORE", credits: 4, hours: 4, description: "Full-stack javascript technologies: Node.js, Express, React, and MongoDB connectivity." },
              { code: "MCA203", name: "Cloud Computing & DevOps", type: "CORE", credits: 4, hours: 4, description: "AWS infrastructure services, virtualization, Docker containers, Kubernetes, and CI/CD pipelines." },
              { code: "MCA204", name: "Software Architecture & Design", type: "CORE", credits: 3, hours: 3, description: "Design patterns, microservice architectures, and secure software development lifecycles." },
              { code: "MCA205L", name: "Node.js & React Full-Stack Lab", type: "LAB", credits: 5, hours: 10, description: "Building responsive single-page full stack applications with real-time API integrations." },
              { code: "MCA206L", name: "Machine Learning & Python Lab", type: "LAB", credits: 4, hours: 8, description: "Implementing ML algorithms, model evaluations, and hyperparameter tunings using python." }
            ]
          }
        ]
      },
      {
        yearName: "2nd Year",
        shortName: "2nd Year",
        label: "SECOND YEAR (SY)",
        semesters: [
          {
            num: 3,
            name: "Semester III",
            credits: 24,
            description: "Focuses on building intelligent systems, cyber security protocols, mobile developments, and mini projects.",
            subjects: [
              { code: "MCA301", name: "Deep Learning & NLP", type: "CORE", credits: 4, hours: 4, description: "Artificial Neural Networks, CNNs, RNNs, and introducing Natural Language Processing techniques." },
              { code: "MCA302", name: "Cyber Security & Digital Forensics", type: "CORE", credits: 4, hours: 4, description: "Cryptography protocols, security audits, digital signatures, malware reviews, and forensic audits." },
              { code: "MCA303", name: "Mobile App Development", type: "CORE", credits: 4, hours: 4, description: "Designing native and cross-platform mobile apps using Flutter or React Native frameworks." },
              { code: "MCA304", name: "Elective - I (Big Data / BlockChain)", type: "CORE", credits: 3, hours: 3, description: "Specialized tracks: Big Data systems (Hadoop/Spark) or Blockchain structures." },
              { code: "MCA305L", name: "Mobile App & Deep Learning Lab", type: "LAB", credits: 5, hours: 10, description: "Coding Flutter interfaces and training CNN/RNN networks on local GPUs." },
              { code: "MCA306P", name: "Mini Project Lab", type: "PROJECT", credits: 4, hours: 8, description: "Developing a complex cloud or AI system from requirements to testing." }
            ]
          },
          {
            num: 4,
            name: "Semester IV",
            credits: 20,
            description: "A full-time semester project involving a live software implementation or industrial training internship.",
            subjects: [
              { code: "MCA401", name: "Enterprise Systems", type: "CORE", credits: 4, hours: 4, description: "Distributed transactions, load balancing, message queues, and enterprise application patterns." },
              { code: "MCA402P", name: "Major Project / Industry Internship", type: "PROJECT", credits: 14, hours: 28, description: "Six months of full-time work in a software company or IT firm culminating in thesis defense." },
              { code: "MCA403S", name: "Technical Seminar & Review", type: "AUDIT", credits: 2, hours: 4, description: "Presentation of technical research, internship findings, and writing professional reports." }
            ]
          }
        ]
      }
    ],
    calendar: [
      { event: "Commencement of Classes", dates: "July 15, 2026", type: "Academic" },
      { event: "First Internal Assessment (Unit Test I)", dates: "August 24 - 28, 2026", type: "Exam" },
      { event: "Tech-Hackathon (YMK-CodeCraft)", dates: "September 18 - 19, 2026", type: "Co-curricular" },
      { event: "Second Internal Assessment (Unit Test II)", dates: "October 05 - 09, 2026", type: "Exam" },
      { event: "Internship Selection & Review Rounds", dates: "October 19 - 23, 2026", type: "Academic" },
      { event: "University Examinations (Theory & Practicals)", dates: "November 18 - December 10, 2026", type: "Exam" }
    ]
  },
  "mba": {
    name: "Master of Business Administration (MBA)",
    shortName: "MBA",
    duration: "2 Years",
    intake: 60,
    choiceCode: "1617337210",
    choiceCodeTfws: "1617337211T",
    dbDeptName: "Management Studies",
    summary: "The MBA program prepares future leaders and managers through advanced studies in marketing, finance, human resources, operations, business analytics, and strategic management. The program emphasizes leadership development, decision-making skills, industry exposure, internships, and real-world business applications.",
    vision: "To be a leading business school that nurtures innovative corporate leaders, strategists, and ethical managers who drive sustainable organizational growth and societal progress.",
    mission: [
      "To deliver high-impact management education combining strategic leadership theories, executive case discussions, and corporate internship projects.",
      "To encourage global business perspectives, data-driven decision-making, and organizational problem-solving skills.",
      "To cultivate high professional standards, personal integrity, and entrepreneurship to create value in the corporate world."
    ],
    programOutcomes: [
      "Generic and Domain Knowledge - Ability to articulate, illustrate, analyze, synthesize and apply the knowledge of principles and frameworks of management and allied domains to the solutions of real-world complex business issues.",
      "Problem Solving & Innovation - Ability to identify, formulate and provide innovative solution frameworks to real world complex business and social problems by systematically applying modern quantitative and qualitative problem-solving tools and techniques.",
      "Critical Thinking - Ability to conduct investigation of multidimensional business problems using research based knowledge and research methods to arrive at data driven decisions.",
      "Effective Communication - Ability to effectively communicate in cross-cultural settings, in technology mediated environments, especially in the business context and with society at large, through oral, written, graphical and virtual means.",
      "Teamwork & Leadership - Ability to work effectively as an individual and as a member or leader in diverse teams across disciplines; demonstrate professional and ethical leadership behaviors.",
      "Social Responsibility - Ability to apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues; demonstrate responsible behavior as a business professional and citizen.",
      "Environment & Sustainability - Ability to understand the impact of business decisions on the society and natural environment; apply principles of sustainable development to professional practice and policy.",
      "Ethics & Values - Ability to apply ethical principles, commit to professional codes of conduct, demonstrate integrity, and act with responsibility in all personal and professional interactions."
    ],
    years: [
      {
        yearName: "1st Year",
        shortName: "1st Year",
        label: "FIRST YEAR (FY)",
        semesters: [
          {
            num: 1,
            name: "Semester I",
            credits: 24,
            description: "Introduces managerial perspectives, economics, marketing, corporate finance, and quantitative techniques.",
            subjects: [
              { code: "MBA101", name: "Management Theory & Practice", type: "CORE", credits: 4, hours: 4, description: "Fundamentals of management functions, planning structures, and corporate governance models." },
              { code: "MBA102", name: "Organizational Behavior", type: "CORE", credits: 4, hours: 4, description: "Personality tests, motivational frameworks, team leadership dynamics, and organizational culture models." },
              { code: "MBA103", name: "Managerial Economics", type: "CORE", credits: 4, hours: 4, description: "Macroeconomics concepts, inflation controls, fiscal policy tools, and micro market pricing models." },
              { code: "MBA104", name: "Financial Reporting & Analysis", type: "CORE", credits: 4, hours: 4, description: "Balance sheet preparation, cash flow statement analysis, and financial ratios calculations." },
              { code: "MBA105", name: "Quantitative Techniques", type: "CORE", credits: 4, hours: 4, description: "Probability, distributions, hypothesis tests, correlation, and business forecasting models." },
              { code: "MBA106L", name: "Business Communication & IT Lab", type: "LAB", credits: 4, hours: 8, description: "Executive report drafting, presentation styles, and spreadsheet modeling frameworks." }
            ]
          },
          {
            num: 2,
            name: "Semester II",
            credits: 24,
            description: "Focuses on strategic management, research tools, operational dynamics, and business law.",
            subjects: [
              { code: "MBA201", name: "Marketing Management", type: "CORE", credits: 4, hours: 4, description: "Customer relationship management, product lifecycles, and integrated brand marketing plans." },
              { code: "MBA202", name: "Human Resource Management", type: "CORE", credits: 4, hours: 4, description: "Manpower planning, performance reviews, labor laws, and executive talent sourcing." },
              { code: "MBA203", name: "Operations & Supply Chain Management", type: "CORE", credits: 4, hours: 4, description: "Logistics systems, plant layouts, material handling models, and quality controls (Six Sigma)." },
              { code: "MBA204", name: "Business Research Methods", type: "CORE", credits: 4, hours: 4, description: "Research methodology, sampling techniques, data gathering, hypothesis tests, and report writing." },
              { code: "MBA205", name: "Financial Management", type: "CORE", credits: 4, hours: 4, description: "Capital budgeting, cost of capital, dividend policy planning, and working capital basics." },
              { code: "MBA206L", name: "Business Research & Stats Lab", type: "LAB", credits: 4, hours: 8, description: "Data entries, hypothesis testing using statistical software, and writing research reports." }
            ]
          }
        ]
      },
      {
        yearName: "2nd Year",
        shortName: "2nd Year",
        label: "SECOND YEAR (SY)",
        semesters: [
          {
            num: 3,
            name: "Semester III",
            credits: 24,
            description: "Focuses on specialization electives, project management, and summer internship reports.",
            subjects: [
              { code: "MBA301", name: "Strategic Management", type: "CORE", credits: 4, hours: 4, description: "SWOT analysis, generic strategies (Porter), strategic implementation, and review frameworks." },
              { code: "MBA302", name: "Enterprise Resource Planning (ERP)", type: "CORE", credits: 4, hours: 4, description: "Business processes, ERP software architectures (SAP/Oracle), and supply chain integrations." },
              { code: "MBA303", name: "Specialization Elective - I", type: "CORE", credits: 4, hours: 4, description: "Specialized tracks: Consumer Behavior (Marketing), Security Analysis (Finance), or HR Planning." },
              { code: "MBA304", name: "Specialization Elective - II", type: "CORE", credits: 4, hours: 4, description: "Advanced studies: Services Marketing (Marketing), Portfolio Management (Finance), or HR Development." },
              { code: "MBA305L", name: "ERP & Analytics Lab", type: "LAB", credits: 4, hours: 8, description: "Practical setups of sales, billing, and accounting modules in sandbox ERP packages." },
              { code: "MBA306P", name: "Summer Internship Project (SIP)", type: "PROJECT", credits: 4, hours: 8, description: "Evaluation and report submission on the 8-week corporate summer internship." }
            ]
          },
          {
            num: 4,
            name: "Semester IV",
            credits: 20,
            description: "Deals with international business, boardroom governance, and major research project evaluations.",
            subjects: [
              { code: "MBA401", name: "International Business", type: "CORE", credits: 4, hours: 4, description: "Globalization trends, balance payments, tariff frameworks, and foreign exchange markets." },
              { code: "MBA402", name: "Corporate Governance & Ethics", type: "CORE", credits: 4, hours: 4, description: "Boardroom ethics, CSR mandates, consumer protections, and environmental codes." },
              { code: "MBA403", name: "Specialization Elective - III", type: "CORE", credits: 4, hours: 4, description: "Final specialization module (e.g. Digital Marketing, Derivatives, or Strategic HR)." },
              { code: "MBA404P", name: "Major Project & Viva-Voce", type: "PROJECT", credits: 8, hours: 16, description: "Comprehensive corporate study project report submission and final external evaluations." }
            ]
          }
        ]
      }
    ],
    calendar: [
      { event: "Commencement of Classes", dates: "July 15, 2026", type: "Academic" },
      { event: "First Internal Assessment (Unit Test I)", dates: "August 24 - 28, 2026", type: "Exam" },
      { event: "Young Managers conclave", dates: "September 15 - 16, 2026", type: "Co-curricular" },
      { event: "Second Internal Assessment (Unit Test II)", dates: "October 05 - 09, 2026", type: "Exam" },
      { event: "Summer Internship Viva Evaluations", dates: "October 19 - 22, 2026", type: "Academic" },
      { event: "University Semester Examinations", dates: "November 18 - December 10, 2026", type: "Exam" }
    ]
  }
};

interface LockedTerminalWrapperProps {
  isUnlocked: boolean;
  isVisible: boolean;
  title?: string;
  standbyText?: string;
  children: React.ReactNode;
}

function LockedTerminalWrapper({
  isUnlocked,
  isVisible,
  title = "TERMINAL SHELL SECURELY LOCKED",
  standbyText = "INITIALIZING MOTION DETECTION STREAM...",
  children
}: LockedTerminalWrapperProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center border border-red-500/20"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-3 animate-pulse">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-red-400 font-mono text-xs tracking-widest font-bold uppercase mb-1">
              [ {title} ]
            </div>
            <p className="text-slate-500 text-[10px] font-mono max-w-md">
              {isVisible 
                ? "DECRYPTING CORE MODULES... SECURE HANDSHAKE IN PROGRESS."
                : standbyText
              }
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

export default function CourseDetails({ params }: { params?: { id: string } }) {
  const [, routeParams] = useRoute("/courses/:id");
  const courseId = params?.id || routeParams?.id;
  const course = courseId ? COURSE_DATA[courseId] : null;

  const [activeTab, setActiveTab] = useState<"faculty" | "academics" | "syllabus" | "calendar">("faculty");
  const [crawlerComplete, setCrawlerComplete] = useState<boolean>(false);

  // States for Hero terminal unlock sequence
  const [isHeroUnlocked, setIsHeroUnlocked] = useState<boolean>(false);
  const [isHeroVisible, setIsHeroVisible] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (courseId === "bca" || courseId === "mca") {
      setIsHeroVisible(true);
      timer = setTimeout(() => {
        setIsHeroUnlocked(true);
      }, 1500); // Auto unlock Hero terminal after 1.5s
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [courseId]);

  // States for cinematic terminal scroll-trigger and decryption
  const cinematicSectionRef = useRef<HTMLDivElement>(null);
  const [isCinematicSectionVisible, setIsCinematicSectionVisible] = useState<boolean>(false);
  const [isCinematicUnlocked, setIsCinematicUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (courseId !== "bca" && courseId !== "mca") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCinematicSectionVisible(true);
        } else {
          // Reset entire state to step 1 when scrolled entirely out of view
          setIsCinematicSectionVisible(false);
          setIsCinematicUnlocked(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    );

    if (cinematicSectionRef.current) {
      observer.observe(cinematicSectionRef.current);
    }

    return () => observer.disconnect();
  }, [courseId]);

  // States for Academics Tab Tree diagram
  const [isTreeExpanded, setIsTreeExpanded] = useState<boolean>(false);
  const [academicsYearIndex, setAcademicsYearIndex] = useState<number | null>(null);
  const [academicsSemIndex, setAcademicsSemIndex] = useState<number | null>(null);

  // Syllabus Tab semester selection pill state
  const [syllabusSemIndex, setSyllabusSemIndex] = useState<number>(0);

  // Subject detail popup state
  const [activeDetailSubject, setActiveDetailSubject] = useState<Subject | null>(null);

  // Fallback timer for crawler animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (courseId === "bca" || courseId === "mca") {
      timer = setTimeout(() => {
        setCrawlerComplete(true);
      }, 8000); // 8 seconds fallback
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [courseId]);

  // Fetch live faculty members from API
  const { data: facultyMembersData, isLoading: isFacultyLoading } = useGetFaculty(
    course ? { department: course.dbDeptName } : undefined
  );
  const liveFaculty = Array.isArray(facultyMembersData) ? facultyMembersData : [];

  if (!course) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4 font-sans">Course Not Found</h2>
          <p className="text-muted-foreground mb-8">The requested academic course details could not be found.</p>
          <Link href="/courses">
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white">
              Back to Academic Programs
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Filter faculty if it is BCA or MCA, select "Computer Applications". If BBA or MBA, select "Management Studies".
  const matchingLive = liveFaculty.filter((f: any) => {
    // Direct string match or department categories
    if (course.shortName === "BCA" || course.shortName === "MCA") {
      return f.department === "Computer Applications" || f.department === "BCA" || f.department === "MCA";
    } else {
      return f.department === "Management Studies" || f.department === "BBA" || f.department === "MBA";
    }
  });

  // Sort HODs first
  const sortedLive = [...matchingLive].sort((a, b) => {
    if (a.isHOD && !b.isHOD) return -1;
    if (!a.isHOD && b.isHOD) return 1;
    return 0;
  });

  // Pad the faculty roster with beautiful "Dr./Prof. (To be updated)" cards if live count is less than 3
  const displayFaculty = sortedLive.length >= 3 ? sortedLive : (() => {
    const paddedList = [...sortedLive];
    const itemsToNeed = 3 - sortedLive.length;

    for (let i = 0; i < itemsToNeed; i++) {
      // HOD card fallback if no live HOD exists
      const needsHOD = !sortedLive.some(f => f.isHOD) && i === 0;
      paddedList.push({
        id: -(i + 1),
        name: needsHOD ? "Dr. (To be updated)" : "Prof. (To be updated)",
        designation: needsHOD ? "Professor & HOD" : "Assistant Professor",
        qualification: "Ph.D. / M.B.A. / M.C.A.",
        specialization: course.shortName,
        isHOD: needsHOD,
        photoUrl: "",
        department: course.dbDeptName,
        createdAt: new Date().toISOString(),
      });
    }
    return paddedList;
  })();

  // Derived helpers for Tree/Academics tab
  const selectedYearObj = academicsYearIndex !== null ? course.years[academicsYearIndex] : null;
  const selectedSemObj = (selectedYearObj && academicsSemIndex !== null)
    ? selectedYearObj.semesters[academicsSemIndex]
    : null;

  // Derived helper for Syllabus tab
  // Gather all semesters in order
  const allSemestersList: SemesterData[] = [];
  course.years.forEach(yr => {
    yr.semesters.forEach(sem => {
      allSemestersList.push(sem);
    });
  });
  const currentSyllabusSem = allSemestersList[syllabusSemIndex] || allSemestersList[0];

  return (
    <AppLayout>
      {/* Course Hero Banner */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Link href="/courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Academic Programs
          </Link>
          <div className="max-w-4xl">
            <Badge className="bg-[#f59e0b] text-white mb-4 px-3 py-1 font-semibold text-xs tracking-wider">
              {course.duration} Program
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {course.name}
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 leading-relaxed">
              {course.summary}
            </p>
            {courseId === "bca" && (
              <div className="mt-8 animate-in fade-in duration-500">
                <LockedTerminalWrapper
                  isUnlocked={isHeroUnlocked}
                  isVisible={isHeroVisible}
                  title="CRAWLER GATEWAY SECURED"
                  standbyText="ESTABLISHING SECURE DATABASE HANDSHAKE..."
                >
                  <Terminal
                    active={isHeroUnlocked}
                    commands={[
                      "atul-crawler --target=bca",
                      "fetch --url=edu-imv.vercel.app/courses/bca",
                      "render --layout"
                    ]}
                    outputs={{
                      0: [
                        "✔ Connected to Indrayani Mahavidyalaya database...",
                        "✔ Target: BCA (3 Years)"
                      ],
                      1: [
                        "✔ Extracted 6 Semesters: Programming, Databases, Web Frameworks."
                      ],
                      2: [
                        " [SUCCESS] BCA Course Layout Rendered Live."
                      ]
                    }}
                    typingSpeed={45}
                    delayBetweenCommands={1000}
                    onComplete={() => setCrawlerComplete(true)}
                  />
                </LockedTerminalWrapper>
              </div>
            )}
            {courseId === "mca" && (
              <div className="mt-8 animate-in fade-in duration-500">
                <LockedTerminalWrapper
                  isUnlocked={isHeroUnlocked}
                  isVisible={isHeroVisible}
                  title="CRAWLER GATEWAY SECURED"
                  standbyText="ESTABLISHING SECURE DATABASE HANDSHAKE..."
                >
                  <Terminal
                    active={isHeroUnlocked}
                    commands={[
                      "atul-crawler --target=mca",
                      "fetch --url=edu-imv.vercel.app/courses/mca",
                      "deploy --env=production"
                    ]}
                    outputs={{
                      0: [
                        "✔ Connected to Indrayani Mahavidyalaya database...",
                        "✔ Target: MCA (2 Years)"
                      ],
                      1: [
                        "✔ Extracted 4 Semesters: Cloud Architectures, Machine Learning, DevOps."
                      ],
                      2: [
                        " [SUCCESS] Production MCA Environment Deployed and Rendered."
                      ]
                    }}
                    typingSpeed={45}
                    delayBetweenCommands={1000}
                    onComplete={() => setCrawlerComplete(true)}
                  />
                </LockedTerminalWrapper>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Stats Grid */}
      <section className="py-6 border-b border-border/80 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">Duration</span>
                <span className="text-sm md:text-base font-bold text-primary">{course.duration}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">Intake Seats</span>
                <span className="text-sm md:text-base font-bold text-primary">{course.intake} Seats</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">Choice Code</span>
                <span className="text-sm md:text-base font-bold text-primary font-mono">{course.choiceCode}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center text-[#f59e0b]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block font-medium">TFWS Code</span>
                <span className="text-sm md:text-base font-bold text-primary font-mono">{course.choiceCodeTfws}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission section */}
      {courseId === "bca" || courseId === "mca" ? (
        <SecurityTerminalEntry
          courseId={courseId}
          courseName={course.name}
          vision={course.vision}
          mission={course.mission}
          duration={course.duration}
          intake={course.intake}
        />
      ) : (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="border-border shadow-md">
              <CardContent className="p-8">
                <div className="h-12 w-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center text-[#f59e0b] mb-6">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-sans">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.vision}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border shadow-md">
              <CardContent className="p-8">
                <div className="h-12 w-12 bg-[#f59e0b]/10 rounded-xl flex items-center justify-center text-[#f59e0b] mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-sans">Our Mission</h2>
                <ul className="space-y-4">
                  {course.mission.map((m, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-muted-foreground text-sm md:text-base">
                      <span className="text-[#f59e0b] font-bold mt-0.5">&bull;</span>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Dynamic Dashboard Graph for BBA & MBA Pages */}
      {(courseId === "bba" || courseId === "mba") && (
        <CourseGraph type={courseId} />
      )}

      {/* Programme Outcomes section */}
      {course.programOutcomes && (
        <section className="py-16 bg-[#0f172a] text-white relative overflow-hidden border-t border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px] opacity-40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge className="bg-[#f59e0b] hover:bg-[#d97706] text-white border-none font-bold text-[10px] tracking-widest uppercase mb-3">
                Programme Outcomes (POs)
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight">
                What You Will Achieve / Graduate Profile
              </h2>
              <p className="text-slate-400 mt-2 text-sm md:text-base leading-relaxed">
                By the end of the {course.shortName} programme, our graduates possess these core capabilities and professional outcomes:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {course.programOutcomes.map((po, idx) => {
                // Split title and description if it has a dash or colon
                const separatorIdx = po.indexOf(" - ");
                const colonIdx = po.indexOf(": ");
                let title = "";
                let desc = po;

                if (separatorIdx !== -1) {
                  title = po.substring(0, separatorIdx);
                  desc = po.substring(separatorIdx + 3);
                } else if (colonIdx !== -1) {
                  title = po.substring(0, colonIdx);
                  desc = po.substring(colonIdx + 2);
                }

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    animate={crawlerComplete ? { opacity: 1, y: 0 } : undefined}
                    whileInView={!crawlerComplete ? { opacity: 1, y: 0 } : undefined}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                    className={`bg-slate-900/60 p-6 rounded-xl border border-slate-800/80 flex items-start gap-4 hover:bg-slate-900 transition-all duration-300 ${
                      courseId === "bca" || courseId === "mca"
                        ? `bg-slate-950 border-slate-800/80 font-mono flex-col p-0 overflow-hidden shadow-lg ${
                            courseId === "bca"
                              ? "hover:border-[#f59e0b]/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                              : "hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                          }`
                        : "hover:border-[#f59e0b]/40"
                    }`}
                  >
                    {courseId === "bca" || courseId === "mca" ? (
                      <>
                        <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800/50 select-none">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                            {courseId === "bca" ? `outcome_${idx + 1}.sh` : `outcome_${idx + 1}.py`}
                          </span>
                          <span className={`text-[8px] font-bold ${courseId === "bca" ? "text-[#f59e0b]" : "text-purple-400"}`}>
                            {courseId === "bca" ? "SH" : "PY"}
                          </span>
                        </div>
                        <div className="p-4 space-y-2 text-left w-full text-xs">
                          <div className="flex items-center gap-1.5">
                            {courseId === "bca" ? (
                              <>
                                <span className="text-amber-500 font-bold">~</span>
                                <span className="text-[#f59e0b] font-bold">$</span>
                                <span className="text-slate-300 font-semibold">cat outcome_{idx + 1}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-blue-400 font-bold">&gt;&gt;&gt;</span>
                                <span className="text-slate-300 font-semibold">python outcome_{idx + 1}.py</span>
                              </>
                            )}
                          </div>
                          <div className="pl-3 border-l border-slate-800 space-y-1">
                            {title && (
                              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                {title}
                              </div>
                            )}
                            <div className="text-slate-400 text-[11px] leading-relaxed">
                              {desc}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] font-bold font-mono text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          {title && (
                            <h4 className="font-bold text-slate-200 text-sm md:text-base mb-1">
                              {title}
                            </h4>
                          )}
                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                            {desc}
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tabs Layout */}
      <section className="py-16 bg-muted/10 border-t border-border/80">
        <div className="container mx-auto px-4">

          {/* Custom Tabs Navigation */}
          <div className="flex border-b border-border/80 max-w-xl mx-auto mb-12 justify-center">
            {(["faculty", "academics", "syllabus", "calendar"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-1 text-center font-bold text-xs md:text-sm uppercase tracking-wider border-b-2 transition-all duration-300 ${activeTab === tab
                  ? "border-[#f59e0b] text-[#f59e0b] bg-white/50"
                  : "border-transparent text-muted-foreground hover:text-primary"
                  }`}
              >
                {tab === "calendar" ? "Academic Calendar" : tab}
              </button>
            ))}
          </div>

          {/* Dynamic Content Rendering */}
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">

            {/* 1. FACULTY ROSTER TAB */}
            {activeTab === "faculty" && (
              <div className="bg-white rounded-2xl border border-border shadow-md p-6 md:p-10">
                <div className="flex flex-col items-center text-center mb-8">
                  <Badge className="bg-blue-50 text-blue-600 border border-blue-100 font-semibold px-3 py-1 text-xs rounded-full mb-3 uppercase tracking-wider">
                    Faculty Roster
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-sans">
                    Department Faculty Members
                  </h3>
                </div>

                {isFacultyLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-[3/4] bg-slate-900 border border-slate-800 rounded-2xl animate-pulse flex flex-col justify-end p-6">
                        <div className="h-6 w-3/4 bg-slate-800 rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayFaculty.map((member) => (
                      <div
                        key={member.id}
                        className="relative overflow-hidden aspect-[3/4] bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-end p-6 group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {/* Grid Pattern Background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40"></div>

                        {/* Image area */}
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-800/20 text-9xl font-bold select-none">
                            {member.name.charAt(0)}
                          </div>
                        )}

                        {/* Dark fading overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 opacity-90"></div>

                        {/* Details */}
                        <div className="relative z-20 text-left">
                          {member.isHOD && (
                            <span className="inline-block bg-[#f59e0b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                              Head of Department
                            </span>
                          )}
                          <h4 className="text-white text-lg font-bold group-hover:text-[#f59e0b] transition-colors leading-tight">
                            {member.name}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1 font-medium">
                            {member.designation}
                          </p>
                          {member.qualification && (
                            <p className="text-slate-500 text-xs mt-1 truncate">
                              {member.qualification}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ACADEMIC STRUCTURE TREE TAB */}
            {activeTab === "academics" && (
              <div>
                {/* Section Header */}
                <div className="bg-white rounded-2xl border border-border shadow-md p-6 mb-8 text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tight font-sans">
                    Academic Structure
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed">
                    The {course.shortName} program is a {course.duration} ({course.years.length * 2}-semester) full-time academic degree affiliated to SPPU, Pune.
                  </p>
                </div>

                {/* Tree Diagram & Details — 2-column flexbox */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                  {/* LEFT COLUMN: Horizontal Tree (scrollable on small viewports, no scrollbars visible) */}
                  <div className="flex-1 lg:max-w-[45%] bg-white rounded-2xl border border-border shadow-sm p-6 overflow-x-auto min-h-[350px] scrollbar-none flex items-center justify-center">
                    <div className="flex flex-row items-center gap-4 min-w-max py-4">

                      {/* Level 1: Degree Root Box */}
                      <div className="relative flex items-center justify-center">
                        <button
                          onClick={() => {
                            const nextState = !isTreeExpanded;
                            setIsTreeExpanded(nextState);
                            if (!nextState) {
                              setAcademicsYearIndex(null);
                              setAcademicsSemIndex(null);
                            }
                          }}
                          className="bg-[#0f172a] text-white p-5 rounded-xl shadow-lg border border-slate-800 flex items-center justify-center gap-2.5 w-40 min-h-[75px] hover:bg-slate-800 transition-all relative z-10 cursor-pointer"
                        >
                          <GraduationCap className="h-6 w-6 text-[#f59e0b]" />
                          <span className="font-bold text-base tracking-wide uppercase">{course.shortName}</span>
                          <span className="text-slate-400 text-sm ml-1 font-semibold select-none">
                            {isTreeExpanded ? "<" : ">"}
                          </span>
                        </button>

                        {/* Root Connector Horizontal Line */}
                        {isTreeExpanded && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 w-6 h-[2px] bg-blue-500/40"></div>
                        )}
                      </div>

                      {/* Level 2: Years Stacked Vertically */}
                      {isTreeExpanded && (
                        <div className="flex flex-col gap-6 pl-4 relative">
                          {/* Vertical connector line */}
                          <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-slate-200" />

                          {course.years.map((yr, yIdx) => {
                            const isYearSelected = academicsYearIndex === yIdx;
                            return (
                              <div key={yIdx} className="flex items-center gap-4 relative">
                                {/* Horizontal link line */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-slate-200" />

                                {/* Year Button Card */}
                                <button
                                  onClick={() => {
                                    if (isYearSelected) {
                                      setAcademicsYearIndex(null);
                                      setAcademicsSemIndex(null);
                                    } else {
                                      setAcademicsYearIndex(yIdx);
                                      setAcademicsSemIndex(0);
                                    }
                                  }}
                                  className={`text-left p-4 rounded-xl border transition-all duration-300 w-52 shadow-sm cursor-pointer ${isYearSelected
                                    ? "bg-amber-50/50 border-[#f59e0b] ring-2 ring-[#f59e0b]/10"
                                    : "bg-white border-border/80 hover:border-slate-400 hover:bg-slate-50"
                                    }`}
                                >
                                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">
                                    {yr.label}
                                  </span>
                                  <span className="text-sm font-bold text-primary block leading-tight">
                                    {yr.shortName}
                                  </span>
                                </button>

                                {/* Level 3: Semester Pills */}
                                {isYearSelected && (
                                  <div className="flex flex-col gap-2.5 relative pl-4 animate-in fade-in slide-in-from-left-1 duration-200">
                                    {/* Horizontal connector to sem stack */}
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[2px] bg-blue-500/30"></div>
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-blue-500/30"></div>

                                    {yr.semesters.map((sem, sIdx) => {
                                      const isSemSelected = academicsSemIndex === sIdx;
                                      return (
                                        <button
                                          key={sIdx}
                                          onClick={() => setAcademicsSemIndex(sIdx)}
                                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative z-10 w-24 text-center cursor-pointer ${isSemSelected
                                            ? "bg-[#0f172a] text-white shadow-md"
                                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                            }`}
                                        >
                                          SEM {sem.num}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Semester Details (flex-1) */}
                  {selectedSemObj ? (
                    <div className="flex-1 bg-white rounded-2xl border border-border shadow-md overflow-hidden animate-in fade-in duration-300 min-w-0">

                      {/* Compact Blue Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-white/20 hover:bg-white/20 text-white border-none font-bold text-[10px] tracking-widest uppercase">
                            SEM {selectedSemObj.num}
                          </Badge>
                          <h4 className="text-base font-bold font-sans">{selectedSemObj.name}</h4>
                        </div>
                        <div className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-right shrink-0">
                          <span className="text-[9px] text-white/70 block uppercase tracking-wider font-semibold leading-none">Credits</span>
                          <span className="text-sm font-bold justify-center">{selectedSemObj.credits}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed px-5 py-3 border-b border-border/60">
                        {selectedSemObj.description}
                      </p>

                      {/* Subject Cards — 2-col grid */}
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[480px]">
                        {selectedSemObj.subjects.map((sub) => (
                          <div
                            key={sub.code}
                            onClick={() => setActiveDetailSubject(sub)}
                            className="p-3 rounded-lg border border-border/80 hover:border-[#f59e0b]/50 hover:shadow-sm transition-all duration-200 bg-slate-50/60 cursor-pointer group"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-[9px] font-bold text-slate-400 font-mono tracking-tight">{sub.code}</span>
                              <Badge className={`text-[9px] font-bold px-1.5 py-0 rounded ${sub.type === "CORE"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : sub.type === "LAB"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : sub.type === "PROJECT"
                                    ? "bg-purple-50 text-purple-600 border border-purple-100"
                                    : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}>
                                {sub.type}
                              </Badge>
                            </div>
                            <h5 className="font-semibold text-primary text-xs leading-snug group-hover:text-[#f59e0b] transition-colors">
                              {sub.name}
                            </h5>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-1.5">
                              <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5 text-[#f59e0b]" />{sub.hours}h/wk</span>
                              <span>{sub.credits} cr</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Hint when nothing is selected yet */
                    isTreeExpanded && (
                      <div className="flex-1 flex items-center justify-center min-h-[200px] text-slate-400 text-sm">
                        ← Select a semester from the tree to view subjects
                      </div>
                    )
                  )}

                </div>
              </div>
            )}


            {/* 3. SUBJECT-WISE SYLLABUS TAB */}
            {activeTab === "syllabus" && (
              <div className="bg-white rounded-2xl border border-border shadow-md p-6 md:p-10">

                {/* Header */}
                <div className="mb-8 text-left">
                  <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 font-semibold px-2.5 py-0.5 text-xs rounded-full mb-3 uppercase tracking-wider">
                    Subject-wise Syllabus
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary font-sans leading-tight">
                    Subject-wise Syllabus
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm md:text-base">
                    The detailed syllabus for each subject based on the latest SPPU guidelines.
                  </p>
                </div>

                {/* Horizontal Semester Pills selection */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-border/80 scrollbar-thin">
                  {allSemestersList.map((sem, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSyllabusSemIndex(idx)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${syllabusSemIndex === idx
                        ? "bg-[#0f172a] text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-transparent"
                        }`}
                    >
                      Semester {sem.num}
                    </button>
                  ))}
                </div>

                {/* Grid layout containing primary blue card + subject cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">



                  {/* Subject Cards */}
                  {currentSyllabusSem.subjects.map((sub) => (
                    <div
                      key={sub.code}
                      className="group [perspective:1000px] h-[220px] w-full cursor-pointer"
                    >
                      <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-2xl border border-border/80 p-6 flex flex-col justify-between shadow-sm">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-bold text-slate-400 font-mono">{sub.code}</span>
                              <Badge className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${sub.type === "CORE"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : sub.type === "LAB"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}>
                                {sub.type}
                              </Badge>
                            </div>
                            <h4 className="font-bold text-primary text-base font-sans group-hover:text-[#f59e0b] transition-colors leading-snug mb-3">
                              {sub.name}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="text-slate-300">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 font-sans">
                              {sub.credits} Credits
                            </span>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between border border-slate-800 shadow-md">
                          <div className="text-left">
                            <span className="text-[9px] font-bold text-[#f59e0b] font-mono tracking-wider uppercase block mb-1">
                              Subject Summary
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed line-clamp-4">
                              {sub.description || "Detailed syllabus modules covering theoretical concepts, practical application frameworks, and continuous assessments."}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDetailSubject(sub);
                            }}
                            className="w-full py-2 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-4"
                          >
                            View Syllabus Details &rarr;
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* 4. ACADEMIC CALENDAR TAB */}
            {activeTab === "calendar" && (
              <div className="bg-white rounded-2xl border border-border shadow-md p-6 md:p-10">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <Badge className="bg-purple-50 text-purple-600 border border-purple-100 font-semibold px-2.5 py-0.5 text-xs rounded-full mb-2 uppercase tracking-wider">
                      Academic Term
                    </Badge>
                    <h3 className="text-xl md:text-2xl font-bold text-primary font-sans">
                      Academic Calendar Schedule
                    </h3>
                  </div>
                  <Calendar className="w-8 h-8 text-[#f59e0b]/40 hidden md:block" />
                </div>

                <div className="overflow-x-auto rounded-xl border border-border/80 shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-primary border-b border-border">
                        <th className="p-4 font-bold text-sm md:text-base border-r border-border/40">Event / Activity</th>
                        <th className="p-4 font-bold text-sm md:text-base border-r border-border/40">Scheduled Dates</th>
                        <th className="p-4 font-bold text-sm md:text-base text-center">Event Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {course.calendar.map((ev, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40">
                          <td className="p-4 text-xs md:text-sm text-primary font-semibold border-r border-border/40">
                            {ev.event}
                          </td>
                          <td className="p-4 text-xs md:text-sm text-foreground font-medium border-r border-border/40">
                            {ev.dates}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.type === "Exam"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : ev.type === "Co-curricular"
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              }`}>
                              {ev.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Subject Detailed Syllabus Modal/Dialog */}
      <Dialog open={!!activeDetailSubject} onOpenChange={(open) => !open && setActiveDetailSubject(null)}>
        {activeDetailSubject && (
          <DialogContent className="sm:max-w-[500px] border-border bg-background">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400 font-mono">{activeDetailSubject.code}</span>
                <Badge className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${activeDetailSubject.type === "CORE"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : activeDetailSubject.type === "LAB"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}>
                  {activeDetailSubject.type}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold text-primary font-sans leading-tight">
                {activeDetailSubject.name}
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-2.5">
                {activeDetailSubject.description}
              </DialogDescription>
            </DialogHeader>

            <div className="border-t border-border pt-4 mt-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> Syllabus Modules / Units
              </h4>
              <ul className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                {(activeDetailSubject.modules || [
                  "Unit 1: Introduction and Foundational Theories",
                  "Unit 2: Implementation and Case Structures",
                  "Unit 3: Intermediate Systems Analysis & Exercises",
                  "Unit 4: Advanced Frameworks and Practice Applications"
                ]).map((mod, idx) => (
                  <li key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs md:text-sm text-slate-700 font-medium">
                    {mod}
                  </li>
                ))}
              </ul>
            </div>

            <DialogFooter className="mt-6 border-t border-border pt-4 flex gap-2 sm:justify-end">
              <div className="text-left text-xs text-slate-400 font-medium mr-auto self-center flex items-center gap-2">
                <span>Credits: <strong className="text-primary font-bold">{activeDetailSubject.credits}</strong></span>
                <span>•</span>
                <span>Weekly Hours: <strong className="text-primary font-bold">{activeDetailSubject.hours}</strong></span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveDetailSubject(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AppLayout>
  );
}
