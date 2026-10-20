export interface PlanetTelemetry {
  label: string;
  value: string;
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
}

export const SOLAR_PLANETS: PlanetData[] = [
  {
    id: 'home',
    name: 'Phạm An',
    displayTitle: 'P H A M   A N',
    subtitle: 'Sinh Viên Đầu Năm 3 // Khoa Công Nghệ Thông Tin - ĐH Hàng Hải Việt Nam',
    navLabel: 'Home',
    category: 'core',
    color: '#00d2ff',
    glowColor: '#00f3ff',
    size: 5.8,
    orbitRadius: 0,
    orbitSpeed: 0,
    textureType: 'earth',
    telemetry: [
      { label: 'HỌ VÀ TÊN', value: 'Phạm An' },
      { label: 'TRƯỜNG ĐÀO TẠO', value: 'ĐH Hàng Hải VN' },
      { label: 'CHUYÊN NGÀNH', value: 'Công Nghệ Thông Tin' },
      { label: 'NĂM HỌC HIỆN TẠI', value: 'Đầu Năm 3 (K64)' },
      { label: 'TỌA ĐỘ', value: 'Hải Phòng, VN' },
    ],
    description:
      'Chào bạn! Tôi là Phạm An, hiện đang là sinh viên đầu năm 3 chuyên ngành Công nghệ Thông tin tại Trường Đại học Hàng hải Việt Nam (VMU). Tôi chưa có kinh nghiệm làm việc thực tế tại doanh nghiệp; website này được tạo ra để tổng hợp thông tin học tập của bản thân và kết nối giao lưu với bạn bè, thầy cô và các nhà tuyển dụng.',
    highlights: [
      'Sinh viên chính quy Khoa Công nghệ Thông tin - Trường ĐH Hàng hải Việt Nam',
      'Đang tích lũy kiến thức cơ sở ngành và rèn luyện tư duy lập trình',
      'Thẳng thắn, trung thực, có tinh thần cầu thị và khao khát được học hỏi',
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
    size: 1.5,
    orbitRadius: 10.5,
    orbitSpeed: 0.18,
    textureType: 'gold',
    telemetry: [
      { label: 'TRƯỜNG ĐẠI HỌC', value: 'ĐH Hàng Hải Việt Nam' },
      { label: 'KHOA TRỰC THUỘC', value: 'Khoa Công Nghệ Thông Tin' },
      { label: 'HỆ ĐÀO TẠO', value: 'Kỹ Sư Chính Quy' },
      { label: 'NIÊN KHÓA', value: '2022 - 2027' },
      { label: 'ĐỊA CHỈ TRẠM', value: 'Lạch Tray, Hải Phòng' },
    ],
    description:
      'Trường Đại học Hàng hải Việt Nam (VMU) là cái nôi đào tạo uy tín với bề dày truyền thống tại Hải Phòng. Môi trường tại trường rèn luyện cho tôi tính kỷ luật, sự kiên nhẫn và tinh thần trách nhiệm trong học tập cũng như cuộc sống.',
    highlights: [
      'Hoàn thành 2 năm đại cương và nền tảng cơ sở',
      'Đang bước vào giai đoạn môn học chuyên ngành của năm thứ 3',
      'Tham gia đầy đủ các học phần lý thuyết và bài tập thực hành trên lớp',
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
    size: 1.7,
    orbitRadius: 15.5,
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
    size: 1.4,
    orbitRadius: 20.5,
    orbitSpeed: 0.08,
    textureType: 'emerald',
    telemetry: [
      { label: 'MỤC TIÊU LỚN NHẤT', value: 'Tìm Cơ Hội Thực Tập (Intern)' },
      { label: 'VỊ TRÍ MONG MUỐN', value: 'Intern Web / Software Dev' },
      { label: 'THÁI ĐỘ LÀM VIỆC', value: 'Cầu Thị, Lắng Nghe' },
      { label: 'THỜI GIAN', value: 'Linh Hoạt Theo Lịch Học' },
      { label: 'TÂM THẾ', value: 'Sẵn Sàng Bắt Đầu Từ Con Số 0' },
    ],
    description:
      'Tôi nhận thức rõ mình chưa có kinh nghiệm dự án thực tế và những gì làm được qua công cụ AI chưa thể coi là kinh nghiệm bản thân. Vì vậy, tôi mong muốn tìm kiếm một vị trí thực tập sinh để được cọ xát thực tế, học hỏi quy trình bài bản từ các anh chị đi trước.',
    highlights: [
      'Sẵn sàng học hỏi bất kỳ công nghệ hoặc quy trình nào của công ty',
      'Không ngại việc khó, luôn nỗ lực hoàn thành nhiệm vụ được giao',
      'Mong muốn được đóng góp sức trẻ và phát triển bản thân từng ngày',
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
    size: 1.3,
    orbitRadius: 25.5,
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
  },
];
