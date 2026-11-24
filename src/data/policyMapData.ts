export type PolicyDomainId =
  | 'green-climate'
  | 'digital-ai'
  | 'green-jobs'
  | 'education-mobility'
  | 'health-wellbeing'
  | 'youth-governance';

export type PolicyApproachId =
  | 'co-design'
  | 'accessible'
  | 'funding-skills'
  | 'beyond-cities';

export interface PolicyDomain {
  id: PolicyDomainId;
  shortVi: string;
  shortEn: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  color: string;
  // Normalized coordinates inside the 1000x580 SVG constellation canvas
  cx: number;
  cy: number;
}

export interface PolicyApproach {
  id: PolicyApproachId;
  labelVi: string;
  labelEn: string;
}

export interface PolicySurveyResponse {
  id: string;
  name: string;
  city: string;
  ageGroup: '16–19' | '20–24' | '25–30';
  primaryDomain: PolicyDomainId;
  secondaryDomain?: PolicyDomainId;
  approach: PolicyApproachId;
  keyword: string;
  thought: string;
  createdAt: string;
}

export const POLICY_DOMAINS: PolicyDomain[] = [
  {
    id: 'green-climate',
    shortVi: 'Khí hậu & Xanh',
    shortEn: 'Green & Climate',
    titleVi: 'Chuyển đổi Xanh & Ứng phó Khí hậu',
    titleEn: 'Green Transition & Climate Resilience',
    descVi: 'Năng lượng tái tạo, kinh tế tuần hoàn, bảo vệ ĐBSCL và nông nghiệp bền vững.',
    descEn: 'Renewable energy, circular economy, Mekong Delta resilience, and sustainable agriculture.',
    color: '#15B567',
    cx: 235,
    cy: 155,
  },
  {
    id: 'digital-ai',
    shortVi: 'AI & An toàn Số',
    shortEn: 'AI & Digital Safety',
    titleVi: 'Trí tuệ Nhân tạo, An toàn Số & Công nghệ',
    titleEn: 'AI Governance, Digital Safety & Tech',
    descVi: 'Đạo đức AI, bảo vệ dữ liệu cá nhân, kỹ năng số và công nghệ vì cộng đồng.',
    descEn: 'Ethical AI, data privacy, digital literacy, and responsible civic technology.',
    color: '#2573BE',
    cx: 500,
    cy: 112,
  },
  {
    id: 'green-jobs',
    shortVi: 'Việc làm & Khởi nghiệp',
    shortEn: 'Jobs & Startups',
    titleVi: 'Việc làm Xanh & Khởi nghiệp Thời đại mới',
    titleEn: 'Green Careers & Youth Entrepreneurship',
    descVi: 'Kỹ năng ESG, quỹ tài chính xanh, cố vấn khởi nghiệp và việc làm công bằng.',
    descEn: 'ESG skills, green finance tracks, mentorship, and fair future-of-work pathways.',
    color: '#E8A90C',
    cx: 765,
    cy: 155,
  },
  {
    id: 'education-mobility',
    shortVi: 'Giáo dục & Toàn cầu',
    shortEn: 'Education & Mobility',
    titleVi: 'Giáo dục Đại học, Erasmus+ & Kết nối Toàn cầu',
    titleEn: 'Higher Education, Erasmus+ & Global Mobility',
    descVi: 'Trao đổi học thuật EU–ASEAN, học bổng đa vùng miền và kỹ năng liên ngành.',
    descEn: 'EU–ASEAN academic exchanges, regional scholarship access, and cross-disciplinary learning.',
    color: '#123985',
    cx: 770,
    cy: 420,
  },
  {
    id: 'health-wellbeing',
    shortVi: 'Y tế & Sức khỏe',
    shortEn: 'Health & Wellbeing',
    titleVi: 'Y tế Cộng đồng & Sức khỏe Tinh thần',
    titleEn: 'Public Health & Youth Mental Wellbeing',
    descVi: 'Chăm sóc sức khỏe tinh thần người trẻ, môi trường sống lành mạnh và y tế dự phòng.',
    descEn: 'Accessible youth mental healthcare, clean urban environments, and preventive health.',
    color: '#EF3E38',
    cx: 500,
    cy: 468,
  },
  {
    id: 'youth-governance',
    shortVi: 'Tham vấn Chính sách',
    shortEn: 'Youth Governance',
    titleVi: 'Tiếng nói Thanh niên & Quản trị Minh bạch',
    titleEn: 'Youth Voice & Participatory Governance',
    descVi: 'Tham vấn định kỳ với Phái đoàn EU, dữ liệu mở và đồng kiến tạo chính sách địa phương.',
    descEn: 'Structured youth consultations, transparent data, and co-designing public policies.',
    color: '#0E9384',
    cx: 230,
    cy: 420,
  },
];

export const POLICY_APPROACHES: PolicyApproach[] = [
  {
    id: 'co-design',
    labelVi: 'Lắng nghe & đồng kiến tạo sớm cùng người trẻ',
    labelEn: 'Co-design policies with youth from day one',
  },
  {
    id: 'accessible',
    labelVi: 'Truyền thông chính sách rõ ràng, dễ tiếp cận',
    labelEn: 'Make policy language clear and youth-accessible',
  },
  {
    id: 'funding-skills',
    labelVi: 'Đầu tư thực chất vào học bổng, kỹ năng & vốn khởi nghiệp',
    labelEn: 'Invest directly in skills, grants, and green finance',
  },
  {
    id: 'beyond-cities',
    labelVi: 'Mở rộng cơ hội vượt ra ngoài các đô thị lớn',
    labelEn: 'Expand opportunities beyond major cities',
  },
];

export const SURVEY_CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Huế',
  'Hải Phòng',
  'Tỉnh / Thành khác',
];

export const INITIAL_POLICY_RESPONSES: PolicySurveyResponse[] = [
  {
    id: 'pr-01',
    name: 'Ngọc Hân',
    city: 'Cần Thơ',
    ageGroup: '20–24',
    primaryDomain: 'green-climate',
    secondaryDomain: 'green-jobs',
    approach: 'beyond-cities',
    keyword: 'Nông nghiệp tuần hoàn',
    thought: 'Chính sách khí hậu cần đi cùng công nghệ canh tác thích ứng mặn để thanh niên miền Tây bám trụ quê hương.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-02',
    name: 'Đức Minh',
    city: 'Hà Nội',
    ageGroup: '20–24',
    primaryDomain: 'digital-ai',
    secondaryDomain: 'youth-governance',
    approach: 'co-design',
    keyword: 'AI có trách nhiệm',
    thought: 'Cần khung chính sách bảo vệ dữ liệu và giáo dục AI thực hành cho sinh viên ngay từ năm nhất đại học.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-03',
    name: 'Phương Thảo',
    city: 'TP. Hồ Chí Minh',
    ageGroup: '25–30',
    primaryDomain: 'green-jobs',
    secondaryDomain: 'green-climate',
    approach: 'funding-skills',
    keyword: 'Tài chính xanh',
    thought: 'Khởi nghiệp bền vững cần gói tín dụng xanh quy mô nhỏ và mạng lưới mentor từ doanh nghiệp châu Âu.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-04',
    name: 'Quốc Bảo',
    city: 'Đà Nẵng',
    ageGroup: '20–24',
    primaryDomain: 'green-climate',
    secondaryDomain: 'education-mobility',
    approach: 'beyond-cities',
    keyword: 'Kinh tế biển xanh',
    thought: 'Thanh niên miền Trung rất cần chương trình đào tạo chuyên sâu về năng lượng gió ngoài khơi và bảo tồn biển.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-05',
    name: 'Khánh Linh',
    city: 'Hà Nội',
    ageGroup: '16–19',
    primaryDomain: 'health-wellbeing',
    secondaryDomain: 'digital-ai',
    approach: 'accessible',
    keyword: 'Sức khỏe tinh thần',
    thought: 'Chính sách y tế thời đại số nên ưu tiên hỗ trợ tâm lý học đường miễn phí và chống bạo lực mạng.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-06',
    name: 'Tuấn Kiệt',
    city: 'TP. Hồ Chí Minh',
    ageGroup: '20–24',
    primaryDomain: 'digital-ai',
    secondaryDomain: 'green-jobs',
    approach: 'funding-skills',
    keyword: 'Chuyển đổi số kép',
    thought: 'Kết hợp dữ liệu số vào đo lường phát thải sẽ tạo ra hàng ngàn việc làm công nghệ xanh cho thế hệ Gen Z.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-07',
    name: 'Mai Chi',
    city: 'Huế',
    ageGroup: '20–24',
    primaryDomain: 'education-mobility',
    secondaryDomain: 'youth-governance',
    approach: 'beyond-cities',
    keyword: 'Học bổng vùng miền',
    thought: 'Mong thông tin học bổng Erasmus+ và chương trình trao đổi EU được truyền tải gần gũi tới sinh viên các tỉnh.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-08',
    name: 'Gia Huy',
    city: 'Hà Nội',
    ageGroup: '25–30',
    primaryDomain: 'youth-governance',
    secondaryDomain: 'green-climate',
    approach: 'co-design',
    keyword: 'Đồng kiến tạo',
    thought: 'Mô hình Hội đồng Cố vấn Thanh niên như VYAB cần được nhân rộng tới cấp tỉnh để tiếng nói trẻ đi vào thực thi.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-09',
    name: 'Thanh Trúc',
    city: 'Cần Thơ',
    ageGroup: '20–24',
    primaryDomain: 'green-jobs',
    secondaryDomain: 'education-mobility',
    approach: 'funding-skills',
    keyword: 'Chứng chỉ ESG',
    thought: 'Sinh viên cần các khóa học chuẩn quốc tế về báo cáo ESG có học bổng hỗ trợ từ các dự án EU–Việt Nam.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-10',
    name: 'Hoàng Long',
    city: 'Đà Nẵng',
    ageGroup: '25–30',
    primaryDomain: 'digital-ai',
    secondaryDomain: 'education-mobility',
    approach: 'accessible',
    keyword: 'An toàn mạng',
    thought: 'Chính sách công nghệ mới phải bảo vệ người trẻ trước lừa đảo AI và cung cấp bộ quy chuẩn minh bạch.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-11',
    name: 'Thu Hà',
    city: 'Hà Nội',
    ageGroup: '20–24',
    primaryDomain: 'green-climate',
    secondaryDomain: 'health-wellbeing',
    approach: 'co-design',
    keyword: 'Không khí sạch',
    thought: 'Giao thông công cộng xanh và không gian cây xanh đô thị gắn trực tiếp với sức khỏe của người trẻ mỗi ngày.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-12',
    name: 'Nhật Minh',
    city: 'TP. Hồ Chí Minh',
    ageGroup: '20–24',
    primaryDomain: 'education-mobility',
    secondaryDomain: 'green-jobs',
    approach: 'funding-skills',
    keyword: 'Liên kết đại học–doanh nghiệp',
    thought: 'Chương trình đại học cần cập nhật nhanh theo kỹ năng xanh và kỹ năng số thay vì chỉ nặng lý thuyết.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-13',
    name: 'Bích Ngọc',
    city: 'Hải Phòng',
    ageGroup: '16–19',
    primaryDomain: 'youth-governance',
    secondaryDomain: 'digital-ai',
    approach: 'accessible',
    keyword: 'Chính sách dễ hiểu',
    thought: 'Tóm tắt chính sách bằng đồ họa và video ngắn sẽ giúp học sinh, sinh viên hiểu và đóng góp ý kiến nhiều hơn.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-14',
    name: 'Văn Nam',
    city: 'Cần Thơ',
    ageGroup: '25–30',
    primaryDomain: 'green-jobs',
    secondaryDomain: 'green-climate',
    approach: 'beyond-cities',
    keyword: 'Việc làm công bằng',
    thought: 'Chuyển dịch năng lượng xanh cần bảo đảm đào tạo lại nghề cho thanh niên lao động tại các địa phương.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-15',
    name: 'An Nhiên',
    city: 'Hà Nội',
    ageGroup: '20–24',
    primaryDomain: 'health-wellbeing',
    secondaryDomain: 'green-climate',
    approach: 'co-design',
    keyword: 'Đô thị lành mạnh',
    thought: 'Chính sách y tế và khí hậu cần được thiết kế song hành vì nắng nóng cực đoan ảnh hưởng lớn đến người trẻ.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-16',
    name: 'Hải Yến',
    city: 'Đà Nẵng',
    ageGroup: '20–24',
    primaryDomain: 'education-mobility',
    secondaryDomain: 'youth-governance',
    approach: 'beyond-cities',
    keyword: 'Mạng lưới ASEAN–EU',
    thought: 'Kết nối thanh niên Việt Nam với bạn bè ASEAN và Châu Âu giúp lan tỏa các sáng kiến cộng đồng thực tế.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-17',
    name: 'Trung Hiếu',
    city: 'TP. Hồ Chí Minh',
    ageGroup: '25–30',
    primaryDomain: 'digital-ai',
    secondaryDomain: 'youth-governance',
    approach: 'co-design',
    keyword: 'Dữ liệu mở',
    thought: 'Mở dữ liệu công khai về môi trường và việc làm sẽ giúp startup trẻ xây dựng giải pháp xã hội chính xác hơn.',
    createdAt: '27/11/2026',
  },
  {
    id: 'pr-18',
    name: 'Minh Thư',
    city: 'Hà Nội',
    ageGroup: '20–24',
    primaryDomain: 'green-climate',
    secondaryDomain: 'youth-governance',
    approach: 'accessible',
    keyword: 'Kinh tế tuần hoàn',
    thought: 'Cần chính sách khuyến khích cụ thể cho mô hình tái chế và giảm nhựa dùng một lần trong khuôn viên đại học.',
    createdAt: '27/11/2026',
  },
];
