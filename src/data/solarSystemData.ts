import type { Language } from './translations';

export interface PlanetTelemetry {
  label: string;
  value: string;
}

export interface PlanetSatellite {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  iconType: 'vmu' | 'code' | 'study' | 'goal' | 'facebook' | 'discord' | 'email' | 'github' | 'info';
  link?: string;
  action?: 'link' | 'copy';
}

export interface PlanetData {
  id: string;
  name: string;
  displayTitle: string; // e.g. "P H A M   A N"
  subtitle: string;
  navLabel: string;
  category: 'core' | 'education' | 'knowledge' | 'goals' | 'contact';
  telemetry: PlanetTelemetry[];
  description: string;
  highlights: string[];
  color: string;
  glowColor: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  textureType: 'earth' | 'gold' | 'violet' | 'emerald' | 'coral';
  hasRings?: boolean;
  satellites: PlanetSatellite[];
}

export const SOLAR_PLANETS_VI: PlanetData[] = [
  {
    id: 'home',
    name: 'Phạm An',
    displayTitle: 'PHẠM AN',
    subtitle: 'Sinh viên năm 3 (K65) • Khoa Công nghệ Thông tin - ĐH Hàng hải Việt Nam',
    navLabel: 'Trang chủ',
    category: 'core',
    color: '#00d2ff',
    glowColor: '#00f3ff',
    size: 5.8,
    orbitRadius: 0,
    orbitSpeed: 0,
    textureType: 'earth',
    telemetry: [
      { label: 'Sinh viên', value: 'K65 CNTT' },
      { label: 'Trường đào tạo', value: 'ĐH Hàng Hải Việt Nam' },
      { label: 'Địa điểm', value: 'Hải Phòng, VN' },
      { label: 'Email', value: 'phama6372@gmail.com' },
    ],
    description:
      'Xin chào! Mình là Phạm An, hiện là sinh viên năm thứ 3 chuyên ngành Công nghệ Thông tin tại Trường Đại học Hàng hải Việt Nam (Hải Phòng). Mình lập website này như một góc nhỏ để lưu giữ hành trình học tập, tổng hợp kiến thức đã tích lũy và chia sẻ mục tiêu rèn luyện của bản thân, đồng thời mở rộng kết nối với thầy cô, bạn bè và các anh chị trong ngành.',
    highlights: [
      'Sinh viên chính quy K65 Khoa Công nghệ Thông tin - Trường ĐH Hàng hải Việt Nam',
      'Đang tập trung đào sâu kiến thức cơ sở ngành và rèn luyện tư duy lập trình',
      'Thái độ học tập nghiêm túc, thẳng thắn, luôn có tinh thần cầu thị và ham học hỏi',
      'Chủ động tự tìm hiểu công nghệ mới, hướng tới cơ hội thực tập cọ xát thực tế',
    ],
    satellites: [
      {
        id: 'sat-home-vmu',
        title: 'Sinh viên K65 CNTT',
        subtitle: 'Khoa CNTT - VMU',
        detail: 'Đang theo học chương trình đào tạo Kỹ sư Công nghệ Thông tin tại Trường ĐH Hàng hải Việt Nam.',
        iconType: 'vmu',
      },
      {
        id: 'sat-home-email',
        title: 'Email cá nhân',
        subtitle: 'phama6372@gmail.com',
        detail: 'Hòm thư liên hệ trao đổi học tập & công việc: phama6372@gmail.com (Bấm để sao chép).',
        iconType: 'email',
        link: 'mailto:phama6372@gmail.com',
        action: 'copy',
      },
      {
        id: 'sat-home-github',
        title: 'GitHub cá nhân',
        subtitle: 'github.com/FamAnVMU',
        detail: 'Trang cá nhân GitHub lưu trữ các bài tập thực hành và mã nguồn: github.com/FamAnVMU.',
        iconType: 'github',
        link: 'https://github.com/FamAnVMU',
        action: 'link',
      },
      {
        id: 'sat-home-location',
        title: 'Hải Phòng, VN',
        subtitle: 'Thành phố Cảng',
        detail: 'Học tập và sinh sống tại thành phố Cảng Hải Phòng - trung tâm kinh tế biển năng động.',
        iconType: 'info',
      },
    ],
  },
  {
    id: 'vmu',
    name: 'Đại Học Hàng Hải',
    displayTitle: 'ĐẠI HỌC HÀNG HẢI',
    subtitle: 'Môi trường đào tạo • Trường Đại học Hàng hải Việt Nam (Hải Phòng)',
    navLabel: 'ĐH Hàng Hải',
    category: 'education',
    color: '#f59e0b',
    glowColor: '#fbbf24',
    size: 2.6,
    orbitRadius: 13.5,
    orbitSpeed: 0.18,
    textureType: 'gold',
    telemetry: [
      { label: 'Cơ sở đào tạo', value: 'ĐH Hàng Hải VN' },
      { label: 'Khoa chuyên môn', value: 'Công Nghệ Thông Tin' },
      { label: 'Khóa học', value: 'Khóa K65 (Năm 3)' },
      { label: 'Địa chỉ', value: '484 Lạch Tray, Hải Phòng' },
    ],
    description:
      'Trường Đại học Hàng hải Việt Nam (VMU) là ngôi trường giàu truyền thống tại Hải Phòng, nơi mình đang được trang bị cả về kiến thức chuyên môn lẫn tác phong kỷ luật. Nếp sống nghiêm túc và tinh thần vượt khó tại VMU giúp mình xây dựng thói quen làm việc trách nhiệm, cẩn trọng và kiên trì trong từng bài toán lập trình.',
    highlights: [
      'Hoàn thành vững chắc giai đoạn đại cương và các môn cơ sở toán - tin',
      'Đang đào sâu các môn học chuyên ngành trọng tâm của năm thứ 3 khóa K65',
      'Rèn luyện nếp sống kỷ luật, tinh thần trách nhiệm và khả năng làm việc nhóm',
    ],
    satellites: [
      {
        id: 'sat-vmu-history',
        title: 'Trường ĐH Trọng Điểm',
        subtitle: 'Thành lập 1956',
        detail: 'Trường đại học trọng điểm quốc gia, trung tâm đào tạo nguồn nhân lực chất lượng cao của cả nước.',
        iconType: 'vmu',
      },
      {
        id: 'sat-vmu-faculty',
        title: 'Khoa CNTT - VMU',
        subtitle: 'Đơn vị chuyên môn',
        detail: 'Đào tạo kỹ sư có kiến thức toàn diện về phần mềm, hệ thống thông tin và mạng máy tính.',
        iconType: 'study',
      },
      {
        id: 'sat-vmu-spirit',
        title: 'Kỷ luật Hàng hải',
        subtitle: 'Tác phong chuẩn mực',
        detail: 'Rèn luyện sự kiên định, kỷ luật tự giác, tinh thần đồng đội và trách nhiệm cao.',
        iconType: 'info',
      },
      {
        id: 'sat-vmu-campus',
        title: 'Cơ sở Lạch Tray',
        subtitle: '484 Lạch Tray, HP',
        detail: 'Khuôn viên đào tạo chính của trường tại quận Ngô Quyền, thành phố Hải Phòng.',
        iconType: 'vmu',
      },
    ],
  },
  {
    id: 'knowledge',
    name: 'Kiến Thức Nền Tảng',
    displayTitle: 'KIẾN THỨC NỀN TẢNG',
    subtitle: 'Khoa học Máy tính & Kỹ thuật Lập trình • Kiến thức đã và đang học',
    navLabel: 'Kiến Thức',
    category: 'knowledge',
    color: '#a855f7',
    glowColor: '#c084fc',
    size: 2.9,
    orbitRadius: 18.5,
    orbitSpeed: 0.12,
    textureType: 'violet',
    hasRings: true,
    telemetry: [
      { label: 'Ngôn ngữ', value: 'C / C++, Python cơ bản' },
      { label: 'Cơ sở dữ liệu', value: 'SQL / MySQL' },
      { label: 'Tư duy cốt lõi', value: 'OOP, Cấu Trúc Dữ Liệu' },
      { label: 'Mở rộng', value: 'Web Frontend, Git & GitHub' },
    ],
    description:
      'Trong chương trình học tại trường, mình luôn ưu tiên nắm thật chắc các nguyên lý cốt lõi: từ tư duy giải thuật với C/C++, lập trình hướng đối tượng (OOP) đến thiết kế cơ sở dữ liệu quan hệ và mạng máy tính. Bên cạnh đó, mình chủ động tự học thêm về lập trình Web hiện đại và rèn luyện kỹ năng quản lý mã nguồn với Git.',
    highlights: [
      'Nắm chắc tư duy lập trình hướng đối tượng (OOP) và giải thuật cơ bản',
      'Biết thiết kế mô hình dữ liệu quan hệ (ERD) và viết truy vấn SQL hiệu quả',
      'Hiểu nguyên lý hoạt động của mạng máy tính, hệ điều hành và kiến trúc Web',
      'Sử dụng thành thạo Git/GitHub để quản lý mã nguồn và làm việc nhóm',
    ],
    satellites: [
      {
        id: 'sat-know-cpp',
        title: 'Kỹ thuật lập trình',
        subtitle: 'C / C++ căn bản',
        detail: 'Xây dựng tư duy giải thuật, quản lý bộ nhớ con trỏ và cấu trúc dữ liệu cơ bản.',
        iconType: 'code',
      },
      {
        id: 'sat-know-oop',
        title: 'Lập trình OOP',
        subtitle: 'Tư duy đối tượng',
        detail: 'Áp dụng 4 tính chất Đóng gói, Kế thừa, Đa hình và Trừu tượng hóa trong tổ chức mã nguồn.',
        iconType: 'code',
      },
      {
        id: 'sat-know-db',
        title: 'Cơ sở dữ liệu',
        subtitle: 'SQL & MySQL',
        detail: 'Thiết kế lược đồ quan hệ ERD, chuẩn hóa bảng dữ liệu và tối ưu các câu lệnh truy vấn.',
        iconType: 'study',
      },
      {
        id: 'sat-know-web',
        title: 'Tự học Web Frontend',
        subtitle: 'HTML, CSS, JS, React',
        detail: 'Chủ động tìm hiểu kiến trúc Web hiện đại, responsive design và xây dựng giao diện người dùng.',
        iconType: 'code',
      },
    ],
  },
  {
    id: 'goals',
    name: 'Mục Tiêu Năm 3',
    displayTitle: 'MỤC TIÊU NĂM 3',
    subtitle: 'Định hướng phát triển • Tìm kiếm cơ hội thực tập cọ xát thực tế',
    navLabel: 'Mục Tiêu',
    category: 'goals',
    color: '#10b981',
    glowColor: '#34d399',
    size: 2.4,
    orbitRadius: 23.5,
    orbitSpeed: 0.08,
    textureType: 'emerald',
    telemetry: [
      { label: 'Mục tiêu', value: 'Tìm vị trí thực tập (Intern)' },
      { label: 'Vị trí', value: 'Web / Software Dev' },
      { label: 'Lịch học', value: 'Linh hoạt theo K65' },
      { label: 'Thái độ', value: 'Cầu thị, sẵn sàng học hỏi' },
    ],
    description:
      'Bước sang năm thứ 3, mục tiêu lớn nhất của mình là tìm được một vị trí thực tập phù hợp. Mình mong muốn được gia nhập một đội ngũ thực tế để học hỏi quy trình phát triển phần mềm bài bản, trau dồi tác phong làm việc chuyên nghiệp từ các anh chị đi trước và đóng góp sự nhiệt huyết của bản thân.',
    highlights: [
      'Sẵn sàng tiếp thu công nghệ, ngôn ngữ hay framework mới theo yêu cầu dự án',
      'Thái độ nghiêm túc, không ngại việc khó và luôn nỗ lực hoàn thành đúng hạn',
      'Tích cực lắng nghe góp ý từ mentor để cải thiện chất lượng công việc mỗi ngày',
      'Khát khao học hỏi thực tế và gắn bó lâu dài cùng doanh nghiệp',
    ],
    satellites: [
      {
        id: 'sat-goal-intern',
        title: 'Tìm kiếm thực tập',
        subtitle: 'Mục tiêu trọng tâm',
        detail: 'Mong muốn gia nhập doanh nghiệp công nghệ để cọ xát với các bài toán thực tế.',
        iconType: 'goal',
      },
      {
        id: 'sat-goal-learn',
        title: 'Học hỏi quy trình chuẩn',
        subtitle: 'Tích lũy kinh nghiệm',
        detail: 'Làm quen với quy trình Agile/Scrum, quản lý công việc trên Jira/Trello và văn hóa code review.',
        iconType: 'study',
      },
      {
        id: 'sat-goal-attitude',
        title: 'Thái độ cầu thị',
        subtitle: 'Tinh thần học hỏi',
        detail: 'Luôn chủ động lắng nghe, không giấu điểm yếu và sẵn sàng bắt đầu từ những nhiệm vụ cơ bản.',
        iconType: 'goal',
      },
      {
        id: 'sat-goal-grad',
        title: 'Mục tiêu tốt nghiệp',
        subtitle: 'Kỹ sư CNTT',
        detail: 'Hoàn thành xuất sắc chương trình học và đồ án tốt nghiệp tại Trường ĐH Hàng hải Việt Nam.',
        iconType: 'vmu',
      },
    ],
  },
  {
    id: 'contact',
    name: 'Liên Hệ & Kết Nối',
    displayTitle: 'LIÊN HỆ & KẾT NỐI',
    subtitle: 'Kênh liên lạc trực tiếp của Phạm An',
    navLabel: 'Liên Hệ',
    category: 'contact',
    color: '#f43f5e',
    glowColor: '#fb7185',
    size: 2.4,
    orbitRadius: 28.5,
    orbitSpeed: 0.05,
    textureType: 'coral',
    telemetry: [
      { label: 'Email', value: 'phama6372@gmail.com' },
      { label: 'GitHub', value: 'github.com/FamAnVMU' },
      { label: 'Facebook', value: 'pham.an.123114' },
      { label: 'Discord', value: 'FamAnVMU' },
    ],
    description:
      'Mình luôn sẵn lòng đón nhận mọi cơ hội kết nối, lời khuyên về nghề nghiệp hoặc đơn giản là trò chuyện về công nghệ và học tập. Bạn có thể gửi email hoặc nhắn tin cho mình qua các kênh bên dưới, mình sẽ phản hồi sớm nhất có thể!',
    highlights: [
      'Email: phama6372@gmail.com (Hộp thư làm việc & trao đổi chính)',
      'GitHub: github.com/FamAnVMU (Mã nguồn các bài tập và dự án thực hành)',
      'Facebook: facebook.com/pham.an.123114 (Trang cá nhân)',
      'Discord ID: FamAnVMU (846953344903282758)',
    ],
    satellites: [
      {
        id: 'sat-conn-fb',
        title: 'Facebook cá nhân',
        subtitle: 'pham.an.123114',
        detail: 'Kết nối mạng xã hội và theo dõi các chia sẻ học tập thường nhật.',
        iconType: 'facebook',
        link: 'https://www.facebook.com/pham.an.123114',
        action: 'link',
      },
      {
        id: 'sat-conn-dc',
        title: 'Discord Profile',
        subtitle: 'FamAnVMU',
        detail: 'Trò chuyện công nghệ và thảo luận lập trình qua máy chủ Discord.',
        iconType: 'discord',
        link: 'https://discord.com/users/846953344903282758',
        action: 'link',
      },
      {
        id: 'sat-conn-mail',
        title: 'Email trực tiếp',
        subtitle: 'phama6372@gmail.com',
        detail: 'Hòm thư liên hệ trao đổi công việc, cơ hội thực tập và học tập.',
        iconType: 'email',
        link: 'mailto:phama6372@gmail.com',
        action: 'copy',
      },
      {
        id: 'sat-conn-git',
        title: 'GitHub Repository',
        subtitle: 'github.com/FamAnVMU',
        detail: 'Nơi lưu trữ các bài tập thực hành và mã nguồn của Phạm An.',
        iconType: 'github',
        link: 'https://github.com/FamAnVMU',
        action: 'link',
      },
    ],
  },
];

export const SOLAR_PLANETS_EN: PlanetData[] = [
  {
    id: 'home',
    name: 'Pham An',
    displayTitle: 'PHAM AN',
    subtitle: '3rd Year IT Student (K65) • Faculty of IT - Vietnam Maritime University',
    navLabel: 'Home',
    category: 'core',
    color: '#00d2ff',
    glowColor: '#00f3ff',
    size: 5.8,
    orbitRadius: 0,
    orbitSpeed: 0,
    textureType: 'earth',
    telemetry: [
      { label: 'Student', value: 'K65 IT Undergrad' },
      { label: 'University', value: 'Vietnam Maritime Univ' },
      { label: 'Location', value: 'Hai Phong, VN' },
      { label: 'Email', value: 'phama6372@gmail.com' },
    ],
    description:
      'Hello! I am Pham An, a 3rd-year undergraduate majoring in Information Technology at Vietnam Maritime University (VMU). I created this personal space portfolio to document my learning journey, summarize core computer science knowledge, and share my goals as I prepare for an engineering internship. Delighted to connect with mentors, peers, and recruiters!',
    highlights: [
      'Regular undergraduate student Cohort K65, Faculty of Information Technology - VMU',
      'Solidifying core computer science foundations and algorithmic problem-solving',
      'Dedicated, honest, growth-minded, and always eager to learn from feedback',
      'Proactively exploring modern web technologies and software engineering practices',
    ],
    satellites: [
      {
        id: 'sat-home-vmu',
        title: 'K65 IT Student',
        subtitle: 'Faculty of IT - VMU',
        detail: 'Pursuing the Software Engineering & IT curriculum for Cohort K65 at Vietnam Maritime University.',
        iconType: 'vmu',
      },
      {
        id: 'sat-home-email',
        title: 'Personal Email',
        subtitle: 'phama6372@gmail.com',
        detail: 'Direct mailbox for academic and career opportunities: phama6372@gmail.com (Click to copy).',
        iconType: 'email',
        link: 'mailto:phama6372@gmail.com',
        action: 'copy',
      },
      {
        id: 'sat-home-github',
        title: 'GitHub Profile',
        subtitle: 'github.com/FamAnVMU',
        detail: 'Personal GitHub repository storing coursework exercises and projects: github.com/FamAnVMU.',
        iconType: 'github',
        link: 'https://github.com/FamAnVMU',
        action: 'link',
      },
      {
        id: 'sat-home-location',
        title: 'Hai Phong, VN',
        subtitle: 'Port City',
        detail: 'Living and studying in the port city of Hai Phong - a dynamic maritime and economic center.',
        iconType: 'info',
      },
    ],
  },
  {
    id: 'vmu',
    name: 'Maritime Univ',
    displayTitle: 'VIETNAM MARITIME UNIV',
    subtitle: 'Academic Environment • Vietnam Maritime University (Hai Phong)',
    navLabel: 'VMU Orbit',
    category: 'education',
    color: '#f59e0b',
    glowColor: '#fbbf24',
    size: 2.6,
    orbitRadius: 13.5,
    orbitSpeed: 0.18,
    textureType: 'gold',
    telemetry: [
      { label: 'University', value: 'Vietnam Maritime Univ' },
      { label: 'Faculty', value: 'Information Technology' },
      { label: 'Cohort', value: 'K65 (2023 - 2027)' },
      { label: 'Campus', value: '484 Lach Tray, Hai Phong' },
    ],
    description:
      'Vietnam Maritime University (VMU) is a premier national university with a proud heritage in Hai Phong. The university environment has trained me in personal discipline, resilience, and a high sense of responsibility - qualities that I believe are essential for any aspiring software engineer.',
    highlights: [
      'Completed foundational coursework in mathematics, physics, and core computing',
      'Currently taking 3rd-year specialized courses in software engineering and systems',
      'Developed strong habits of self-discipline, teamwork, and thoroughness',
    ],
    satellites: [
      {
        id: 'sat-vmu-history',
        title: 'National Key Univ',
        subtitle: 'Founded 1956',
        detail: 'A prestigious institution committed to training high-quality human resources for the nation.',
        iconType: 'vmu',
      },
      {
        id: 'sat-vmu-faculty',
        title: 'Faculty of IT - VMU',
        subtitle: 'Academic Department',
        detail: 'Training engineers with comprehensive knowledge in software systems and computer networks.',
        iconType: 'study',
      },
      {
        id: 'sat-vmu-spirit',
        title: 'Maritime Discipline',
        subtitle: 'Professional Standards',
        detail: 'Cultivating resilience, self-discipline, teamwork, and high ethical responsibility.',
        iconType: 'info',
      },
      {
        id: 'sat-vmu-campus',
        title: 'Lach Tray Campus',
        subtitle: '484 Lach Tray, HP',
        detail: 'Main campus located in Ngo Quyen District, Hai Phong City.',
        iconType: 'vmu',
      },
    ],
  },
  {
    id: 'knowledge',
    name: 'Foundations',
    displayTitle: 'CORE KNOWLEDGE',
    subtitle: 'Computer Science Core & Programming Techniques • Completed & Ongoing',
    navLabel: 'Knowledge',
    category: 'knowledge',
    color: '#a855f7',
    glowColor: '#c084fc',
    size: 2.9,
    orbitRadius: 18.5,
    orbitSpeed: 0.12,
    textureType: 'violet',
    hasRings: true,
    telemetry: [
      { label: 'Languages', value: 'C / C++, Python' },
      { label: 'Databases', value: 'SQL / MySQL' },
      { label: 'Core', value: 'OOP, Data Structures' },
      { label: 'Expanded', value: 'Web Frontend & Git' },
    ],
    description:
      'Throughout my academic program at VMU, I prioritize mastering fundamental concepts: from algorithm design in C/C++, Object-Oriented Programming (OOP) to relational database architecture and networking. In addition, I proactively learn modern web technologies and clean version control with Git.',
    highlights: [
      'Solid understanding of Object-Oriented Programming (OOP) and fundamental algorithms',
      'Able to design relational ERD schemas, normalize tables, and write optimized SQL queries',
      'Clear grasp of computer networking principles, OS mechanics, and web architecture',
      'Proficient in Git & GitHub for clean version control and collaborative workflows',
    ],
    satellites: [
      {
        id: 'sat-know-cpp',
        title: 'Programming Core',
        subtitle: 'C / C++ Fundamentals',
        detail: 'Developing algorithmic thinking, pointer memory management, and data structures.',
        iconType: 'code',
      },
      {
        id: 'sat-know-oop',
        title: 'OOP Paradigms',
        subtitle: 'Object-Oriented Design',
        detail: 'Applying Encapsulation, Inheritance, Polymorphism, and Abstraction to structure code.',
        iconType: 'code',
      },
      {
        id: 'sat-know-db',
        title: 'SQL Databases',
        subtitle: 'Relational Design',
        detail: 'Designing ERD models, normalizing database tables, and executing structured SQL queries.',
        iconType: 'study',
      },
      {
        id: 'sat-know-web',
        title: 'Web Frontend',
        subtitle: 'HTML, CSS, JS, React',
        detail: 'Proactively exploring modern web architecture, responsive design, and component-based UI.',
        iconType: 'code',
      },
    ],
  },
  {
    id: 'goals',
    name: 'Year 3 Goals',
    displayTitle: 'YEAR 3 GOALS',
    subtitle: 'Career Growth • Actively Seeking Internship Opportunities',
    navLabel: 'Goals',
    category: 'goals',
    color: '#10b981',
    glowColor: '#34d399',
    size: 2.4,
    orbitRadius: 23.5,
    orbitSpeed: 0.08,
    textureType: 'emerald',
    telemetry: [
      { label: 'Objective', value: 'Software/Web Intern' },
      { label: 'Role', value: 'Web / Software Dev' },
      { label: 'Schedule', value: 'Flexible with K65 classes' },
      { label: 'Mindset', value: 'Growth-minded & eager to learn' },
    ],
    description:
      'Entering my 3rd year, my primary objective is securing an engineering internship. I am eager to join a real-world software team to learn standard development workflows, receive mentorship from experienced engineers, and contribute my youthful energy and commitment.',
    highlights: [
      'Eager to adapt to any tech stack, framework, or internal workflow the team requires',
      'Serious attitude, resilient in overcoming challenges, committed to meeting deadlines',
      'Actively listening to mentor feedback to improve code quality continuously',
      'Deep desire to gain industry experience and contribute long-term value',
    ],
    satellites: [
      {
        id: 'sat-goal-intern',
        title: 'Seeking Internship',
        subtitle: 'Primary Target',
        detail: 'Looking to join a software development team to tackle real-world engineering problems.',
        iconType: 'goal',
      },
      {
        id: 'sat-goal-learn',
        title: 'Standard Workflows',
        subtitle: 'Hands-on Growth',
        detail: 'Adopting Agile/Scrum methodologies, tracking tasks on Jira/Trello, and peer code reviews.',
        iconType: 'study',
      },
      {
        id: 'sat-goal-attitude',
        title: 'Growth Attitude',
        subtitle: 'Receptive Mindset',
        detail: 'Always listening attentively to mentors, being honest about weaknesses, and starting from the basics.',
        iconType: 'goal',
      },
      {
        id: 'sat-goal-grad',
        title: 'Graduation Target',
        subtitle: 'IT Engineer',
        detail: 'Successfully completing the engineering curriculum and capstone project at VMU.',
        iconType: 'vmu',
      },
    ],
  },
  {
    id: 'contact',
    name: 'Contact & Connect',
    displayTitle: 'CONTACT & CONNECT',
    subtitle: 'Official Direct Channels of Pham An',
    navLabel: 'Contact',
    category: 'contact',
    color: '#f43f5e',
    glowColor: '#fb7185',
    size: 2.4,
    orbitRadius: 28.5,
    orbitSpeed: 0.05,
    textureType: 'coral',
    telemetry: [
      { label: 'Email', value: 'phama6372@gmail.com' },
      { label: 'GitHub', value: 'github.com/FamAnVMU' },
      { label: 'Facebook', value: 'pham.an.123114' },
      { label: 'Discord', value: 'FamAnVMU' },
    ],
    description:
      'I deeply value every opportunity to connect, receive career advice, or simply discuss technology and university life. Feel free to drop me an email or message through any of the channels below - I will reply as promptly as possible!',
    highlights: [
      'Email: phama6372@gmail.com (Primary contact for work and academic inquiries)',
      'GitHub: github.com/FamAnVMU (Public repositories and lab assignments)',
      'Facebook: facebook.com/pham.an.123114 (Personal profile)',
      'Discord ID: FamAnVMU (846953344903282758)',
    ],
    satellites: [
      {
        id: 'sat-conn-fb',
        title: 'Personal Facebook',
        subtitle: 'pham.an.123114',
        detail: 'Social network connection and following daily student life.',
        iconType: 'facebook',
        link: 'https://www.facebook.com/pham.an.123114',
        action: 'link',
      },
      {
        id: 'sat-conn-dc',
        title: 'Discord Profile',
        subtitle: 'FamAnVMU',
        detail: 'Tech conversations and programming discussions on Discord.',
        iconType: 'discord',
        link: 'https://discord.com/users/846953344903282758',
        action: 'link',
      },
      {
        id: 'sat-conn-mail',
        title: 'Direct Email',
        subtitle: 'phama6372@gmail.com',
        detail: 'Direct mailbox for job inquiries, internship opportunities, and study exchange.',
        iconType: 'email',
        link: 'mailto:phama6372@gmail.com',
        action: 'copy',
      },
      {
        id: 'sat-conn-git',
        title: 'GitHub Repository',
        subtitle: 'github.com/FamAnVMU',
        detail: 'Repository storing coding exercises and source code by Pham An.',
        iconType: 'github',
        link: 'https://github.com/FamAnVMU',
        action: 'link',
      },
    ],
  },
];

export const getSolarPlanets = (lang: Language = 'vi'): PlanetData[] => {
  return lang === 'en' ? SOLAR_PLANETS_EN : SOLAR_PLANETS_VI;
};

export const SOLAR_PLANETS = SOLAR_PLANETS_VI;
