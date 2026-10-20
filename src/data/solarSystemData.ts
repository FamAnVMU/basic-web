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

export const SOLAR_PLANETS: PlanetData[] = [
  {
    id: 'home',
    name: 'Phạm An',
    displayTitle: 'P H A M   A N',
    subtitle: 'Sinh Viên Đầu Năm 3 (K65) // Khoa Công Nghệ Thông Tin - ĐH Hàng Hải Việt Nam',
    navLabel: 'Home',
    category: 'core',
    color: '#00d2ff',
    glowColor: '#00f3ff',
    size: 5.8,
    orbitRadius: 0,
    orbitSpeed: 0,
    textureType: 'earth',
    telemetry: [
      { label: 'HỌ VÀ TÊN', value: 'Phạm An (K65)' },
      { label: 'TRƯỜNG ĐÀO TẠO', value: 'ĐH Hàng Hải VN' },
      { label: 'CHUYÊN NGÀNH', value: 'Công Nghệ Thông Tin' },
      { label: 'EMAIL LIÊN HỆ', value: 'phama6372@gmail.com' },
      { label: 'GITHUB CÁ NHÂN', value: 'github.com/FamAnVMU' },
    ],
    description:
      'Chào bạn! Tôi là Phạm An, hiện đang là sinh viên đầu năm 3 (khóa K65) chuyên ngành Công nghệ Thông tin tại Trường Đại học Hàng hải Việt Nam (VMU). Tôi chưa có kinh nghiệm làm việc thực tế tại doanh nghiệp; website này được tạo ra để tổng hợp thông tin học tập của bản thân và kết nối giao lưu với bạn bè, thầy cô và các nhà tuyển dụng.',
    highlights: [
      'Sinh viên chính quy K65 Khoa Công nghệ Thông tin - Trường ĐH Hàng hải Việt Nam',
      'Đang tích lũy kiến thức cơ sở ngành và rèn luyện tư duy lập trình',
      'Thẳng thắn, trung thực, có tinh thần cầu thị và khao khát được học hỏi',
      'Chủ động tự tìm hiểu công nghệ mới và xây dựng nền móng vững chắc',
    ],
    satellites: [
      {
        id: 'sat-home-vmu',
        title: 'Sinh Viên K65 CNTT',
        subtitle: 'Khoa CNTT - VMU',
        detail: 'Đang theo học chương trình đào tạo Kỹ sư Công nghệ Thông tin khóa K65 tại Trường ĐH Hàng hải Việt Nam.',
        iconType: 'vmu',
      },
      {
        id: 'sat-home-email',
        title: 'Email Cá Nhân',
        subtitle: 'phama6372@gmail.com',
        detail: 'Hòm thư liên hệ chính thức: phama6372@gmail.com (Bấm để sao chép nhanh).',
        iconType: 'email',
        link: 'mailto:phama6372@gmail.com',
        action: 'copy',
      },
      {
        id: 'sat-home-github',
        title: 'GitHub Profile',
        subtitle: 'github.com/FamAnVMU',
        detail: 'Trang cá nhân GitHub lưu trữ các bài tập thực hành lập trình: github.com/FamAnVMU.',
        iconType: 'github',
        link: 'https://github.com/FamAnVMU',
        action: 'link',
      },
      {
        id: 'sat-home-location',
        title: 'Hải Phòng, VN',
        subtitle: 'Tọa độ học tập',
        detail: 'Học tập và sinh sống tại thành phố Cảng Hải Phòng - trung tâm kinh tế biển năng động.',
        iconType: 'info',
      },
    ],
  },
  {
    id: 'vmu',
    name: 'Đại Học Hàng Hải',
    displayTitle: 'V M U   O R B I T',
    subtitle: 'Môi Trường Đào Tạo // Trường Đại Học Hàng Hải Việt Nam (Hải Phòng)',
    navLabel: 'Học Vấn (VMU)',
    category: 'education',
    color: '#f59e0b',
    glowColor: '#fbbf24',
    size: 2.2,
    orbitRadius: 13.5,
    orbitSpeed: 0.18,
    textureType: 'gold',
    telemetry: [
      { label: 'TRƯỜNG ĐẠI HỌC', value: 'ĐH Hàng Hải Việt Nam' },
      { label: 'KHOA TRỰC THUỘC', value: 'Khoa Công Nghệ Thông Tin' },
      { label: 'KHÓA SINH VIÊN', value: 'Khóa K65 (Năm 3)' },
      { label: 'HỆ ĐÀO TẠO', value: 'Kỹ Sư Chính Quy' },
      { label: 'ĐỊA CHỈ TRẠM', value: 'Lạch Tray, Hải Phòng' },
    ],
    description:
      'Trường Đại học Hàng hải Việt Nam (VMU) là cái nôi đào tạo uy tín với bề dày truyền thống tại Hải Phòng. Môi trường tại trường rèn luyện cho tôi tính kỷ luật, sự kiên nhẫn và tinh thần trách nhiệm trong học tập cũng như cuộc sống.',
    highlights: [
      'Hoàn thành 2 năm đại cương và nền tảng cơ sở',
      'Đang bước vào giai đoạn môn học chuyên ngành của năm thứ 3 khóa K65',
      'Tham gia đầy đủ các học phần lý thuyết và bài tập thực hành trên lớp',
    ],
    satellites: [
      {
        id: 'sat-vmu-history',
        title: 'Mái Trường Đại Dương',
        subtitle: 'Thành lập 1956',
        detail: 'Trường đại học trọng điểm quốc gia, trung tâm đào tạo nguồn nhân lực chất lượng cao.',
        iconType: 'vmu',
      },
      {
        id: 'sat-vmu-faculty',
        title: 'Khoa CNTT - VMU',
        subtitle: 'Đơn vị đào tạo',
        detail: 'Đào tạo kỹ sư có kiến thức toàn diện về phần mềm, hệ thống thông tin và mạng máy tính.',
        iconType: 'study',
      },
      {
        id: 'sat-vmu-spirit',
        title: 'Kỷ Luật Hàng Hải',
        subtitle: 'Môi trường rèn luyện',
        detail: 'Tác phong chuẩn chỉ, tinh thần vượt khó, tính đồng đội và trách nhiệm cao.',
        iconType: 'info',
      },
      {
        id: 'sat-vmu-campus',
        title: '484 Lạch Tray',
        subtitle: 'Trụ sở chính',
        detail: 'Khuôn viên đào tạo chính tại quận Ngô Quyền, thành phố Hải Phòng.',
        iconType: 'vmu',
      },
    ],
  },
  {
    id: 'knowledge',
    name: 'Kiến Thức Nền Tảng',
    displayTitle: 'K N O W L E D G E',
    subtitle: 'Nền Móng Khoa Học Máy Tính // Các Môn Đã & Đang Học Tại Trường',
    navLabel: 'Kiến Thức',
    category: 'knowledge',
    color: '#a855f7',
    glowColor: '#c084fc',
    size: 2.4,
    orbitRadius: 18.5,
    orbitSpeed: 0.12,
    textureType: 'violet',
    hasRings: true,
    telemetry: [
      { label: 'NGÔN NGỮ ĐÃ HỌC', value: 'C / C++, Python cơ bản' },
      { label: 'CƠ SỞ DỮ LIỆU', value: 'SQL / MySQL' },
      { label: 'KIẾN THỨC NỀN', value: 'OOP, Cấu Trúc Dữ Liệu' },
      { label: 'MẠNG & HỆ ĐIỀU HÀNH', value: 'Đã Hoàn Thành Môn' },
      { label: 'TỰ TÌM HIỂU', value: 'HTML, CSS, JS Cơ Bản' },
    ],
    description:
      'Trong 2 năm qua tại VMU, tôi đã được trang bị các kiến thức nền tảng vững chắc của ngành CNTT: tư duy giải thuật qua C/C++, lập trình hướng đối tượng (OOP), thiết kế cơ sở dữ liệu quan hệ và nguyên lý mạng máy tính. Thời gian rảnh, tôi tự tìm hiểu thêm về kiến trúc Web.',
    highlights: [
      'Nắm được tư duy hướng đối tượng (OOP) và giải thuật cơ bản',
      'Biết viết câu lệnh truy vấn dữ liệu SQL và thiết kế bảng CSDL',
      'Hiểu quy trình vận hành của mạng máy tính và hệ điều hành',
    ],
    satellites: [
      {
        id: 'sat-know-cpp',
        title: 'Lập Trình C / C++',
        subtitle: 'Môn học đại cương',
        detail: 'Đã hoàn thành các học phần Tin học đại cương & Kỹ thuật lập trình C/C++.',
        iconType: 'code',
      },
      {
        id: 'sat-know-oop',
        title: 'Lập Trình OOP',
        subtitle: 'Tư duy đối tượng',
        detail: 'Hiểu các nguyên lý Đóng gói, Kế thừa, Đa hình và Trừu tượng hóa trong lập trình.',
        iconType: 'code',
      },
      {
        id: 'sat-know-db',
        title: 'Cơ Sở Dữ Liệu SQL',
        subtitle: 'Quản trị dữ liệu',
        detail: 'Thiết kế mô hình quan hệ ERD, chuẩn hóa bảng và truy vấn dữ liệu với MySQL.',
        iconType: 'study',
      },
      {
        id: 'sat-know-web',
        title: 'Tự Học Web Cơ Bản',
        subtitle: 'HTML, CSS, JS, React',
        detail: 'Chủ động tìm hiểu kiến trúc Web hiện đại, cách hoạt động của DOM và giao diện cơ bản.',
        iconType: 'code',
      },
    ],
  },
  {
    id: 'goals',
    name: 'Mục Tiêu Năm 3',
    displayTitle: 'F U T U R E   G O A L S',
    subtitle: 'Định Hướng Thực Tế // Tìm Kiếm Cơ Hội Học Hỏi & Thực Tập',
    navLabel: 'Mục Tiêu',
    category: 'goals',
    color: '#10b981',
    glowColor: '#34d399',
    size: 2.0,
    orbitRadius: 23.5,
    orbitSpeed: 0.08,
    textureType: 'emerald',
    telemetry: [
      { label: 'MỤC TIÊU LỚN NHẤT', value: 'Tìm Cơ Hội Thực Tập (Intern)' },
      { label: 'VỊ TRÍ MONG MUỐN', value: 'Intern Web / Software Dev' },
      { label: 'THÁI ĐỘ LÀM VIỆC', value: 'Cầu Thị, Lắng Nghe' },
      { label: 'THỜI GIAN', value: 'Linh Hoạt Theo Lịch Học K65' },
      { label: 'TÂM THẾ', value: 'Sẵn Sàng Bắt Đầu Từ Con Số 0' },
    ],
    description:
      'Tôi nhận thức rõ mình chưa có kinh nghiệm dự án thực tế và những gì làm được qua công cụ AI chưa thể coi là kinh nghiệm bản thân. Vì vậy, tôi mong muốn tìm kiếm một vị trí thực tập sinh để được cọ xát thực tế, học hỏi quy trình bài bản từ các anh chị đi trước.',
    highlights: [
      'Sẵn sàng học hỏi bất kỳ công nghệ hoặc quy trình nào của công ty',
      'Không ngại việc khó, luôn nỗ lực hoàn thành nhiệm vụ được giao',
      'Mong muốn được đóng góp sức trẻ và phát triển bản thân từng ngày',
    ],
    satellites: [
      {
        id: 'sat-goal-intern',
        title: 'Tìm Vị Trí Thực Tập',
        subtitle: 'Mục tiêu số 1',
        detail: 'Tìm cơ hội gia nhập một đội ngũ công nghệ để cọ xát với môi trường làm việc thực tế.',
        iconType: 'goal',
      },
      {
        id: 'sat-goal-learn',
        title: 'Học Quy Trình Chuẩn',
        subtitle: 'Tích lũy kinh nghiệm',
        detail: 'Học cách làm việc nhóm với Git, quản lý task (Jira/Trello) và viết code sạch.',
        iconType: 'study',
      },
      {
        id: 'sat-goal-attitude',
        title: 'Chăm Chỉ & Cầu Thị',
        subtitle: 'Cam kết thái độ',
        detail: 'Lắng nghe phản hồi từ anh chị mentor, không giấu dốt và sẵn sàng làm từ việc nhỏ nhất.',
        iconType: 'goal',
      },
      {
        id: 'sat-goal-grad',
        title: 'Tốt Nghiệp Kỹ Sư',
        subtitle: 'Chặng đường dài',
        detail: 'Hoàn thành xuất sắc đồ án tốt nghiệp tại Trường ĐH Hàng hải Việt Nam.',
        iconType: 'vmu',
      },
    ],
  },
  {
    id: 'contact',
    name: 'Liên Hệ & Kết Nối',
    displayTitle: 'C O N N E C T I O N',
    subtitle: 'Cổng Liên Lạc Vũ Trụ // Kết Nối Trực Tiếp Với Phạm An',
    navLabel: 'Liên Hệ',
    category: 'contact',
    color: '#f43f5e',
    glowColor: '#fb7185',
    size: 1.8,
    orbitRadius: 28.5,
    orbitSpeed: 0.05,
    textureType: 'coral',
    telemetry: [
      { label: 'FACEBOOK', value: 'pham.an.123114' },
      { label: 'DISCORD', value: 'FamAnVMU' },
      { label: 'EMAIL', value: 'phama6372@gmail.com' },
      { label: 'GITHUB', value: 'github.com/FamAnVMU' },
      { label: 'TRẠNG THÁI', value: 'Luôn Sẵn Sàng Trả Lời' },
    ],
    description:
      'Nếu bạn là nhà tuyển dụng, thầy cô hoặc bạn bè muốn kết nối trao đổi, tôi luôn rất vui lòng được trò chuyện qua các kênh liên lạc dưới đây. Tất cả tin nhắn đều được tôi phản hồi sớm nhất!',
    highlights: [
      'Facebook: facebook.com/pham.an.123114',
      'Discord ID: FamAnVMU (846953344903282758)',
      'Email: phama6372@gmail.com',
      'GitHub: github.com/FamAnVMU',
    ],
    satellites: [
      {
        id: 'sat-conn-fb',
        title: 'Facebook Cá Nhân',
        subtitle: 'pham.an.123114',
        detail: 'Kết nối mạng xã hội và theo dõi các chia sẻ học tập thường nhật.',
        iconType: 'facebook',
        link: 'https://www.facebook.com/pham.an.123114',
        action: 'link',
      },
      {
        id: 'sat-conn-dc',
        title: 'Discord Profile',
        subtitle: 'FamAnVMU (846953344903282758)',
        detail: 'Trò chuyện công nghệ và thảo luận lập trình qua máy chủ Discord.',
        iconType: 'discord',
        link: 'https://discord.com/users/846953344903282758',
        action: 'link',
      },
      {
        id: 'sat-conn-mail',
        title: 'Email Trực Tiếp',
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
