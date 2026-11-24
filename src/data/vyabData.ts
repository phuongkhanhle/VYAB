export type Lang = 'vi' | 'en';
export type PillarKey = 'engage' | 'empower' | 'connect';

export interface Milestone {
  id: string;
  dateVi: string;
  dateEn: string;
  titleVi: string;
  titleEn: string;
  locationVi: string;
  locationEn: string;
  scope: 'domestic' | 'international';
  detailVi: string;
  detailEn: string;
  pillar: PillarKey;
}

export interface FeaturedActivity {
  id: string;
  cityVi: string;
  cityEn: string;
  programVi: string;
  programEn: string;
  dateVi: string;
  dateEn: string;
  attendeesVi: string;
  attendeesEn: string;
  summaryVi: string;
  summaryEn: string;
  highlightsVi: string[];
  highlightsEn: string[];
  image: string;
  captionVi: string;
  captionEn: string;
}

export interface PillarContent {
  key: PillarKey;
  index: string;
  nameVi: string;
  nameEn: string;
  accentHex: string;
  taglineVi: string;
  taglineEn: string;
  descriptionVi: string;
  descriptionEn: string;
  recommendationsVi: string[];
  recommendationsEn: string[];
}

export interface PersonProfile {
  name: string;
  roleVi: string;
  roleEn: string;
  group: 'leadership' | 'advisor' | 'member';
  image?: string;
  imagePosition?: string;
  imageTransform?: string;
  initials: string;
  accentHex: string;
  noteVi?: string;
  noteEn?: string;
}

export interface QuizQuestion {
  id: string;
  questionVi: string;
  questionEn: string;
  factVi: string;
  factEn: string;
  options: {
    id: string;
    labelVi: string;
    labelEn: string;
    isCorrect: boolean;
    pillar: PillarKey;
  }[];
}

export interface VoiceNote {
  id: string;
  author: string;
  city: string;
  topic: string;
  pillar: PillarKey;
  message: string;
  votes: number;
  createdAt: string;
}

export interface PollOption {
  id: string;
  pillar: PillarKey;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  baseVotes: number;
}

export const IMPACT_STATS = [
  {
    value: '25+',
    labelVi: 'Hoạt động & đối thoại',
    labelEn: 'Activities & engagements',
    detailVi: 'Tham vấn thanh niên, tập huấn ESG và giao lưu đối tác EU (2024–2026)',
    detailEn: 'Youth consultations, ESG masterclasses, and EU partner exchanges (2024–2026)',
    accentHex: '#071642',
  },
  {
    value: '04',
    labelVi: 'Thành phố tại Việt Nam',
    labelEn: 'Cities across Viet Nam',
    detailVi: 'Hà Nội, TP. Hồ Chí Minh, Cần Thơ và Đà Nẵng',
    detailEn: 'Hanoi, Ho Chi Minh City, Can Tho, and Da Nang',
    accentHex: '#e63e2d',
  },
  {
    value: '300+',
    labelVi: 'Lượt tham dự Việc làm Xanh',
    labelEn: 'Green career attendances',
    detailVi: 'Tuần lễ Ngoại giao Xanh tại Hà Nội & Greener Pathways tại Cần Thơ, Đà Nẵng',
    detailEn: 'Green Diplomacy Weeks in Hanoi & Greener Pathways in Can Tho and Da Nang',
    accentHex: '#16a360',
  },
  {
    value: '03',
    labelVi: 'Diễn đàn chính sách quốc tế',
    labelEn: 'International dialogue cities',
    detailVi: 'Brussels, Kuala Lumpur và Manila — kết nối tiếng nói thanh niên Việt Nam',
    detailEn: 'Brussels, Kuala Lumpur, and Manila — elevating Vietnamese youth voices',
    accentHex: '#1c62b9',
  },
];

export const FEATURED_ACTIVITIES: FeaturedActivity[] = [
  {
    id: 'hanoi',
    cityVi: 'Hà Nội',
    cityEn: 'Hanoi',
    programVi: 'Tuần lễ Ngoại giao Xanh EU–ASEAN',
    programEn: 'EU–ASEAN Green Diplomacy Weeks',
    dateVi: 'Tháng 12, 2024',
    dateEn: 'December 2024',
    attendeesVi: '100+ người tham dự',
    attendeesEn: '100+ participants',
    summaryVi:
      'Với chủ đề "Hướng tới Lực lượng Thanh niên Xanh", sự kiện tại Hà Nội quy tụ hơn 100 bạn trẻ, chuyên gia môi trường và đại diện Phái đoàn EU thảo luận về kỹ năng xanh và chuyển dịch công bằng.',
    summaryEn:
      'Themed "Towards a Greener Youth Force", the Hanoi forum convened 100+ young leaders, climate specialists, and EU Delegation representatives around green skills and just transition.',
    highlightsVi: [
      'Đối thoại trực tiếp giữa sinh viên, chuyên gia năng lượng tái tạo và Phái đoàn EU',
      'Khai mở lộ trình đào tạo kỹ năng xanh và kinh tế tuần hoàn cho thế hệ trẻ',
      'Thu thập kiến nghị thực tiễn đưa vào Báo cáo Nhiệm kỳ 2024–2026',
    ],
    highlightsEn: [
      'Direct dialogue uniting students, renewable energy leaders, and the EU Delegation',
      'Mapped green skills and circular economy pathways for young graduates',
      'Synthesized youth policy input directly into the 2024–2026 Inaugural Report',
    ],
    image: '/assets/vyab/photo_01_767x332.jpg',
    captionVi: 'Hình 01 — Đoàn đại biểu và thanh niên tại Tuần lễ Ngoại giao Xanh, Hà Nội',
    captionEn: 'Fig. 01 — Delegates and youth advocates at Green Diplomacy Weeks, Hanoi',
  },
  {
    id: 'cantho',
    cityVi: 'Cần Thơ',
    cityEn: 'Can Tho',
    programVi: 'Greener Pathways: ĐBSCL Bền Vững',
    programEn: 'Greener Pathways: Sustainable Mekong Delta',
    dateVi: 'Tháng 5, 2026',
    dateEn: 'May 2026',
    attendeesVi: '100+ sinh viên & nhà sáng lập',
    attendeesEn: '100+ students & founders',
    summaryVi:
      'Tổ chức tại Đại học Cần Thơ với tọa đàm "Cơ hội Việc làm Xanh: Góc nhìn từ người trong ngành", kết nối thanh niên miền Tây với các mô hình nông nghiệp bền vững như Lúa Mùa Tư Việt, Abavina và Green Connect.',
    summaryEn:
      'Hosted at Can Tho University under "Green Job Opportunities: Insider Perspectives", connecting Mekong Delta youth with sustainable agriculture pioneers including Lua Mua Tu Viet, Abavina JSC, and Green Connect.',
    highlightsVi: [
      'Chia sẻ thực tế từ các nhà sáng lập doanh nghiệp xanh tại Đồng bằng sông Cửu Long',
      'Mở rộng tiếp cận thông tin nghề nghiệp xanh và tài chính xanh ngoài các đô thị lớn',
      'Đưa tiếng nói thanh niên ĐBSCL tới đàm phán EU–ASEAN tại Manila',
    ],
    highlightsEn: [
      'First-hand insights from Mekong Delta sustainable agriculture & green tech founders',
      'Expanded green career awareness and mentorship beyond major metropolitan hubs',
      'Carried Mekong Delta youth insights directly to ASEAN–EU talks in Manila',
    ],
    image: '/assets/vyab/photo_02_767x332.jpg',
    captionVi: 'Hình 02 — Tọa đàm Cơ hội Việc làm Xanh tại Đại học Cần Thơ',
    captionEn: 'Fig. 02 — Green Career Opportunities panel at Can Tho University',
  },
  {
    id: 'danang',
    cityVi: 'Đà Nẵng',
    cityEn: 'Da Nang',
    programVi: 'Greener Pathways: Miền Trung Bền Vững',
    programEn: 'Greener Pathways: Sustainable Central Viet Nam',
    dateVi: 'Năm 2026',
    dateEn: '2026',
    attendeesVi: '100+ thanh niên miền Trung',
    attendeesEn: '100+ Central Viet Nam youth',
    summaryVi:
      'Tọa đàm "Hành trình Xanh: Nâng cao năng lực Thanh niên hướng tới Miền Trung Phát triển Bền vững" tập trung vào kinh tế biển xanh, chuyển đổi số và kết nối nguồn lực hợp tác EU–Việt Nam.',
    summaryEn:
      'The forum "Empowering Youth for a Sustainable Central Viet Nam" focused on blue economy skills, digital readiness, and connecting regional youth to EU–Viet Nam cooperation initiatives.',
    highlightsVi: [
      'Thảo luận chuyên sâu về kỹ năng kinh tế biển xanh (blue economy) và du lịch bền vững',
      'Kết nối mạng lưới thanh niên miền Trung với cựu sinh viên Erasmus+ và đối tác EU',
      'Đóng góp dữ liệu khu vực cho khuyến nghị giáo dục đại học tại diễn đàn ASEAN–EU',
    ],
    highlightsEn: [
      'Focused workshops on blue economy careers and climate-resilient coastal development',
      'Connected Central Viet Nam students with Erasmus+ alumni and EU partner networks',
      'Contributed regional higher-education recommendations to ASEAN–EU dialogues',
    ],
    image: '/assets/vyab/photo_03_767x332.jpg',
    captionVi: 'Hình 03 — Tọa đàm Hành trình Xanh hướng tới Miền Trung Phát triển Bền vững, Đà Nẵng',
    captionEn: 'Fig. 03 — Greener Pathways youth capacity-building seminar in Da Nang',
  },
];

export const PILLARS: PillarContent[] = [
  {
    key: 'engage',
    index: '01',
    nameVi: 'Gắn Kết · Engage',
    nameEn: 'Engage',
    accentHex: '#e63e2d',
    taglineVi: 'Khuếch đại tiếng nói thanh niên trong hoạch định chính sách EU–Việt Nam',
    taglineEn: "Amplifying young people's voices in EU–Viet Nam policy and decision-making",
    descriptionVi:
      'Tạo lập cơ chế tham vấn định kỳ và minh bạch để thanh niên Việt Nam không chỉ là đối tượng thụ hưởng, mà là đối tác đồng kiến tạo trong các chương trình hợp tác song phương.',
    descriptionEn:
      'Building regular, structured consultative channels so Vietnamese youth act as co-creators—not merely beneficiaries—in bilateral EU–Viet Nam partnerships.',
    recommendationsVi: [
      'Tăng cường tham vấn thanh niên định kỳ trong các khuôn khổ hợp tác EU–Việt Nam',
      'Thúc đẩy hợp tác thanh niên thông qua các sáng kiến hiện có của Liên minh Châu Âu',
      'Giúp các cơ hội và chương trình hợp tác EU–Việt Nam dễ tiếp cận hơn với người trẻ',
      'Thúc đẩy năng lực số và văn hóa sử dụng công nghệ có trách nhiệm trong thanh niên',
    ],
    recommendationsEn: [
      'Strengthen regular youth consultation in EU–Viet Nam cooperation',
      'Facilitate youth collaboration through existing EU initiatives',
      'Make EU–Viet Nam cooperation and opportunities more accessible to young people',
      'Promote digital literacy and responsible technology use among young people',
    ],
  },
  {
    key: 'empower',
    index: '02',
    nameVi: 'Trao Quyền · Empower',
    nameEn: 'Empower',
    accentHex: '#1c62b9',
    taglineVi: 'Nâng cao năng lực, kỹ năng xanh–số và mạng lưới hành động cho người trẻ',
    taglineEn: 'Building capacity and equipping youth with skills and networks to drive change',
    descriptionVi:
      'Trang bị kỹ năng thực chiến cho chuyển đổi xanh và chuyển đổi số, kết nối thanh niên với cơ hội nghề nghiệp tương lai, cố vấn chuyên môn và nguồn lực khởi nghiệp bền vững.',
    descriptionEn:
      'Equipping youth with green and digital competencies while opening tangible pathways into green careers, mentorship, and sustainable entrepreneurship.',
    recommendationsVi: [
      'Đưa góc nhìn thanh niên vào các chương trình phát triển kỹ năng xanh và kỹ năng số',
      'Cải thiện khả năng tiếp cận thông tin rõ ràng về cơ hội việc làm xanh',
      'Khuyến khích hợp tác giáo dục đại học đáp ứng đúng nhu cầu kỹ năng của thanh niên',
      'Kết nối người trẻ với hệ sinh thái hỗ trợ khởi nghiệp xanh và khởi nghiệp số',
      'Tích hợp an toàn số và sử dụng công nghệ có trách nhiệm vào các khóa đào tạo kỹ năng',
    ],
    recommendationsEn: [
      "Bring young people's perspectives into green and digital skills development",
      "Improve young people's access to information on green careers",
      'Encourage higher education partnerships that respond to youth skills needs',
      'Connect young people with green and digital entrepreneurship support',
      'Integrate digital safety and responsible technology use into youth skills programmes',
    ],
  },
  {
    key: 'connect',
    index: '03',
    nameVi: 'Kết Nối · Connect',
    nameEn: 'Connect',
    accentHex: '#16a360',
    taglineVi: 'Gắn kết thanh niên Việt Nam với các thiết chế EU và mạng lưới khu vực ASEAN',
    taglineEn: 'Fostering connections between Vietnamese youth, EU institutions, and regional partners',
    descriptionVi:
      'Xóa nhòa khoảng cách địa lý để người trẻ ngoài các thành phố lớn tiếp cận cơ hội giáo dục châu Âu, mạng lưới cố vấn đồng đẳng Erasmus+ và các hội đồng thanh niên ASEAN–Toàn cầu.',
    descriptionEn:
      'Bridging geographic divides so young people across every region can access EU education exchanges, Erasmus+ peer mentoring, and ASEAN–Global youth networks.',
    recommendationsVi: [
      'Mở rộng tiếp cận cơ hội giáo dục và hợp tác EU vượt ra ngoài các thành phố lớn',
      'Nâng cao nhận thức của thanh niên về các sáng kiến do EU hỗ trợ tại nhiều vùng miền',
      'Tăng cường cố vấn đồng đẳng thông qua mạng lưới Erasmus+ và cựu du học sinh Châu Âu',
      'Thắt chặt hợp tác giữa các mạng lưới thanh niên trên toàn khu vực ASEAN',
    ],
    recommendationsEn: [
      'Expand access to EU education and cooperation opportunities beyond major cities',
      "Improve young people's awareness of relevant EU-supported initiatives in different regions",
      'Strengthen peer mentoring through Erasmus+ and European alumni networks',
      'Strengthen collaboration among youth networks across ASEAN',
    ],
  },
];

export const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    dateVi: 'Tháng 8, 2024',
    dateEn: 'Aug 2024',
    titleVi: 'Lễ Khởi Động VYAB Khóa 1',
    titleEn: "VYAB's Kick-off Event",
    locationVi: 'Hà Nội, Việt Nam',
    locationEn: 'Hanoi, Viet Nam',
    scope: 'domestic',
    detailVi: 'Chính thức ra mắt Hội đồng Cố vấn Thanh niên Việt Nam Khóa 1 trong khuôn khổ EU Youth Action Plan 2022–2027.',
    detailEn: 'Official launch of the inaugural Vietnam Youth Advisory Board cohort under the EU Youth Action Plan 2022–2027.',
    pillar: 'engage',
  },
  {
    id: 'm2',
    dateVi: 'Tháng 10, 2024',
    dateEn: 'Oct 2024',
    titleVi: 'Sự kiện Thanh niên Cấp cao Global Gateway',
    titleEn: 'Global Gateway High-Level Youth Event',
    locationVi: 'Brussels, Bỉ',
    locationEn: 'Brussels, Belgium',
    scope: 'international',
    detailVi: 'Đại diện VYAB đóng góp trực tiếp góc nhìn thanh niên Việt Nam vào bộ khuyến nghị thanh niên của sáng kiến Global Gateway.',
    detailEn: 'VYAB representative contributed Vietnamese youth perspectives directly to Global Gateway youth recommendations.',
    pillar: 'engage',
  },
  {
    id: 'm3',
    dateVi: 'Tháng 10, 2024',
    dateEn: 'Oct 2024',
    titleVi: 'Diễn giả tại Nordic Day · Diễn đàn Kinh tế Xanh EuroCham',
    titleEn: 'Speaker at Nordic Day, EuroCham Green Economy Forum',
    locationVi: 'TP. Hồ Chí Minh',
    locationEn: 'Ho Chi Minh City',
    scope: 'domestic',
    detailVi: 'Chủ tịch VYAB Phạm Ngọc Anh đại diện tiếng nói thế hệ trẻ thảo luận về chuyển dịch xanh và phát triển bền vững.',
    detailEn: 'VYAB President Pham Ngoc Anh spoke on youth leadership in green transition and sustainable business.',
    pillar: 'empower',
  },
  {
    id: 'm4',
    dateVi: 'Tháng 12, 2024',
    dateEn: 'Dec 2024',
    titleVi: 'Tuần lễ Ngoại giao Xanh EU–ASEAN',
    titleEn: 'EU–ASEAN Green Diplomacy Weeks',
    locationVi: 'Hà Nội, Việt Nam',
    locationEn: 'Hanoi, Viet Nam',
    scope: 'domestic',
    detailVi: 'Chương trình "Towards a Greener Youth Force" thu hút hơn 100 người tham dự đối thoại về kỹ năng và việc làm xanh.',
    detailEn: '"Towards a Greener Youth Force" engaged 100+ participants in green skills and sustainability career dialogue.',
    pillar: 'empower',
  },
  {
    id: 'm5',
    dateVi: 'Tháng 3, 2025',
    dateEn: 'Mar 2025',
    titleVi: 'Diễn đàn Vai trò EU tại ASEAN',
    titleEn: "The EU's Evolving Role in ASEAN",
    locationVi: 'Kuala Lumpur, Malaysia',
    locationEn: 'Kuala Lumpur, Malaysia',
    scope: 'international',
    detailVi: 'Đồng soạn thảo tuyên bố chung thanh niên khu vực về các ưu tiên kỹ năng xanh và trao đổi học thuật.',
    detailEn: 'Co-drafted a regional youth statement prioritizing green skills and academic mobility across ASEAN.',
    pillar: 'connect',
  },
  {
    id: 'm6',
    dateVi: 'Tháng 5 – 8, 2025',
    dateEn: 'May – Aug 2025',
    titleVi: 'Ngày Châu Âu 2025 & Ngày Quốc tế Thanh niên',
    titleEn: 'Europe Day 2025 & International Youth Day Dialogue',
    locationVi: 'Hà Nội & Toàn quốc',
    locationEn: 'Hanoi & Nationwide',
    scope: 'domestic',
    detailVi: 'Kỷ niệm 35 năm quan hệ ngoại giao EU–Việt Nam, hội thảo gắn kết nội bộ (Tháng 7/2025) và đối thoại "Youth Dialogue with the EU" (Tháng 8/2025).',
    detailEn: 'Celebrated 35 years of EU–Viet Nam relations, hosted Internal Networking Workshop (Jul 2025) and "Youth Dialogue with the EU" (Aug 2025).',
    pillar: 'connect',
  },
  {
    id: 'm7',
    dateVi: 'Tháng 5, 2026',
    dateEn: 'May 2026',
    titleVi: 'Phiên họp Cuối Hội đồng Thanh niên EU–ASEAN',
    titleEn: 'EU–ASEAN Youth Sounding Board Final Session',
    locationVi: 'Manila, Philippines',
    locationEn: 'Manila, Philippines',
    scope: 'international',
    detailVi: 'Đưa góc nhìn từ Cần Thơ và Đà Nẵng vào khuyến nghị thanh niên kỷ niệm 50 năm quan hệ EU–ASEAN về giáo dục đại học và kinh tế biển xanh.',
    detailEn: 'Brought insights from Can Tho and Da Nang into 50th Anniversary EU–ASEAN youth talks on higher education and blue economy skills.',
    pillar: 'connect',
  },
  {
    id: 'm8',
    dateVi: 'Tháng 5 – 6, 2026',
    dateEn: 'May – Jun 2026',
    titleVi: 'Greener Pathways & Lớp Chuyên sâu ESG',
    titleEn: 'Greener Pathways & ESG Masterclass for Youth Leaders',
    locationVi: 'Cần Thơ, Đà Nẵng & Hà Nội',
    locationEn: 'Can Tho, Da Nang & Hanoi',
    scope: 'domestic',
    detailVi: 'Chuỗi sự kiện "Empowering Youth for a Sustainable Mekong Delta", tọa đàm Miền Trung bền vững và ESG Masterclass cho thủ lĩnh trẻ.',
    detailEn: 'Flagship regional green career series in Can Tho and Da Nang followed by an ESG Masterclass for young leaders.',
    pillar: 'empower',
  },
  {
    id: 'm9',
    dateVi: 'Tháng 11, 2026',
    dateEn: 'Nov 2026',
    titleVi: 'Đối thoại Chính sách Brussels & Lễ Tổng Kết Khóa 1',
    titleEn: 'Brussels Policy Dialogue & 1st Cohort Finale Showcase',
    locationVi: 'Brussels & Sky Garden, EUD Hà Nội',
    locationEn: 'Brussels & Sky Garden, EUD Hanoi',
    scope: 'international',
    detailVi: 'Phó Chủ tịch Huỳnh Gia Bảo tham dự Youth Policy Dialogue tại Brussels (12/11/2026) trong nhiệm kỳ GYSB 2026–2028; ra mắt Báo cáo Khóa 1 tại Hà Nội (27/11/2026).',
    detailEn: 'VP Huynh Gia Bao represented Viet Nam at the Brussels Youth Policy Dialogue (12 Nov) under the 2026–2028 GYSB mandate, culminating in the Cohort 1 Report Showcase (27 Nov).',
    pillar: 'engage',
  },
];

export const PEOPLE: PersonProfile[] = [
  {
    name: 'Phạm Ngọc Anh',
    roleVi: 'Chủ tịch · President',
    roleEn: 'President',
    group: 'leadership',
    image: '/assets/vyab/members/p34_01_obj1611_702x800.jpg',
    imagePosition: '50% 60%',
    imageTransform: 'translate(-12%, -2%) scale(1.36)',
    initials: 'NA',
    accentHex: '#F04533',
    noteVi: 'Diễn giả tại Nordic Day, EuroCham Green Economy Forum',
    noteEn: 'Speaker at Nordic Day, EuroCham Green Economy Forum',
  },
  {
    name: 'Huỳnh Gia Bảo',
    roleVi: 'Phó Chủ tịch Miền Nam · Thành viên Ban Điều hành GYSB',
    roleEn: 'Vice President (South) · INTPA Global YSB Steering Committee',
    group: 'leadership',
    image: '/assets/vyab/members/p34_03_obj1620_143x132.png',
    imagePosition: '50% 48%',
    imageTransform: 'scale(1.26)',
    initials: 'GB',
    accentHex: '#00104E',
    noteVi: 'Đại diện Việt Nam trong Hội đồng Thanh niên Toàn cầu EU 2026–2028',
    noteEn: 'Serving on the EU Global Youth Sounding Board (2026–2028)',
  },
  {
    name: 'Lê Thị Khánh Huyền',
    roleVi: 'Phó Chủ tịch Miền Bắc · Vice President',
    roleEn: 'Vice President (North)',
    group: 'leadership',
    image: '/assets/vyab/members/p34_02_obj1614_373x497.jpg',
    imagePosition: '50% 25%',
    imageTransform: 'scale(1.06)',
    initials: 'KH',
    accentHex: '#15B567',
    noteVi: 'Đại diện tại Global Gateway High-Level Youth Event, Brussels',
    noteEn: 'Delegate at Global Gateway High-Level Youth Event, Brussels',
  },
  {
    name: 'Tống Khánh Linh',
    roleVi: 'Cố vấn · Advisor',
    roleEn: 'Advisor',
    group: 'advisor',
    image: '/assets/vyab/members/p34_04_obj1623_768x562.jpg',
    imagePosition: '51% 50%',
    imageTransform: 'translate(0%, -22%) scale(1.52)',
    initials: 'KL',
    accentHex: '#15B567',
  },
  {
    name: 'Linh Hoàng',
    roleVi: 'Cố vấn · Advisor',
    roleEn: 'Advisor',
    group: 'advisor',
    image: '/assets/vyab/members/p34_05_obj1626_410x410.jpg',
    imagePosition: '50% 50%',
    imageTransform: 'translate(-4%, 4%) scale(1.12)',
    initials: 'LH',
    accentHex: '#FFD014',
  },
  {
    name: 'Lê Thị Phương Khanh',
    roleVi: 'Cố vấn · Advisor',
    roleEn: 'Advisor',
    group: 'advisor',
    image: '/assets/vyab/members/p34_06_obj1629_768x1152.jpg',
    imagePosition: '50% 62%',
    imageTransform: 'translate(4%, 0%) scale(1.12)',
    initials: 'PK',
    accentHex: '#F04533',
  },
  {
    name: 'Phạm Nguyễn Đức Anh',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p35_02_obj2457_1095x821.jpg',
    imagePosition: '72% 50%',
    imageTransform: 'scale(1.12)',
    initials: 'ĐA',
    accentHex: '#15B567',
  },
  {
    name: 'Lê Hoài Anh',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p35_01_obj2451_598x896.jpg',
    imagePosition: '50% 100%',
    imageTransform: 'translate(-8%, -4%) scale(1.28)',
    initials: 'HA',
    accentHex: '#FFD014',
  },
  {
    name: 'Trần Tiến Lợi',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p35_08_obj2486_497x884.png',
    imagePosition: '50% 34%',
    imageTransform: 'translate(-5%, 0%) scale(1.14)',
    initials: 'TL',
    accentHex: '#FFD014',
  },
  {
    name: 'Nguyễn Hồng Đăng',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p35_03_obj2463_979x1324.jpg',
    imagePosition: '50% 42%',
    imageTransform: 'translate(-9%, 3%) scale(1.36)',
    initials: 'HĐ',
    accentHex: '#F04533',
  },
  {
    name: 'Giang Thị Hải Đăng',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p35_04_obj2472_489x489.jpg',
    imagePosition: '50% 45%',
    imageTransform: 'scale(1.06)',
    initials: 'HĐ',
    accentHex: '#15B567',
  },
  {
    name: 'Dương Mỹ Định',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p35_06_obj2481_576x768.jpg',
    imagePosition: '50% 66%',
    imageTransform: 'scale(1.12)',
    initials: 'MĐ',
    accentHex: '#FFD014',
  },
  {
    name: 'Nguyễn Thái Dương',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_01_obj2492_419x404.jpg',
    imagePosition: '50% 42%',
    imageTransform: 'scale(1.06)',
    initials: 'TD',
    accentHex: '#15B567',
  },
  {
    name: 'Võ Thị Giàu',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_02_obj2498_423x512.jpg',
    imagePosition: '50% 32%',
    imageTransform: 'scale(1.08)',
    initials: 'TG',
    accentHex: '#FFD014',
  },
  {
    name: 'Nguyễn Phương Hà',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_03_obj2504_330x382.png',
    imagePosition: '50% 42%',
    imageTransform: 'scale(1.08)',
    initials: 'PH',
    accentHex: '#F04533',
  },
  {
    name: 'TS. Trịnh Hồng Bảo Hân',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_04_obj2510_605x807.jpg',
    imagePosition: '50% 52%',
    imageTransform: 'scale(1.12)',
    initials: 'BH',
    accentHex: '#15B567',
  },
  {
    name: 'Nguyễn Thị Lan Hương',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_05_obj2516_768x432.jpg',
    imagePosition: '64% 50%',
    imageTransform: 'translate(0%, 5%) scale(1.14)',
    initials: 'LH',
    accentHex: '#FFD014',
  },
  {
    name: 'Trương Hữu Đăng Khoa',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_06_obj2522_490x735.png',
    imagePosition: '50% 22%',
    imageTransform: 'scale(1.06)',
    initials: 'ĐK',
    accentHex: '#F04533',
  },
  {
    name: 'Trần Cao Ánh Ngọc',
    roleVi: 'Thành viên Khóa 1',
    roleEn: 'Cohort 1 Member',
    group: 'member',
    image: '/assets/vyab/members/p36_07_obj2528_547x547.jpg',
    imagePosition: '50% 42%',
    imageTransform: 'scale(1.05)',
    initials: 'AN',
    accentHex: '#FFD014',
  },
];

export const COHORT_ADDITIONAL_MEMBERS = [
  'Trịnh Mỹ Anh',
];

export const FINALE_AGENDA = [
  {
    time: '16:00 – 16:15',
    titleVi: 'Đón tiếp đại biểu & Trình chiếu Video Dấu ấn Hành trình',
    titleEn: 'Delegate Registration & Milestone Video Screening',
  },
  {
    time: '16:15 – 16:40',
    titleVi: 'Khai mạc & Phát biểu chào mừng — Đại sứ EU Julien Guerrier & VYAB',
    titleEn: 'Official Opening & Remarks — H.E. EU Ambassador Julien Guerrier & VYAB',
  },
  {
    time: '16:45 – 17:00',
    titleVi: 'Ra mắt & Trình bày Chuyên đề: Báo cáo Nhiệm kỳ VYAB (2024–2026)',
    titleEn: 'Launch & Thematic Showcase: VYAB Inaugural Report (2024–2026)',
  },
  {
    time: '17:00 – 17:15',
    titleVi: 'Chia sẻ về Gắn kết Thanh niên & Phái đoàn EU — Mr. Jan Lucas Zimmer & VYAB',
    titleEn: 'Reflections on Youth & EU Delegation Engagement — Mr. Jan Lucas Zimmer & VYAB',
  },
  {
    time: '17:15 – 17:30',
    titleVi: 'Lễ Vinh danh Tri ân Khóa 1 & Phát biểu Bế mạc',
    titleEn: 'Recognition & Appreciation Ceremony & Closing Remarks',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionVi: 'Ba trụ cột cốt lõi của Kế hoạch Hành động Thanh niên EU (2022–2027) mà VYAB theo đuổi là gì?',
    questionEn: 'What are the 3 core pillars of the EU Youth Action Plan (2022–2027) guiding VYAB?',
    factVi: 'Engage (Gắn kết) · Empower (Trao quyền) · Connect (Kết nối) là kim chỉ nam cho mọi đối thoại và sáng kiến của VYAB.',
    factEn: 'Engage, Empower, and Connect form the foundational framework for every VYAB dialogue and initiative.',
    options: [
      { id: 'a', labelVi: 'Engage · Empower · Connect', labelEn: 'Engage · Empower · Connect', isCorrect: true, pillar: 'engage' },
      { id: 'b', labelVi: 'Learn · Invest · Trade', labelEn: 'Learn · Invest · Trade', isCorrect: false, pillar: 'empower' },
      { id: 'c', labelVi: 'Explore · Build · Scale', labelEn: 'Explore · Build · Scale', isCorrect: false, pillar: 'connect' },
    ],
  },
  {
    id: 'q2',
    questionVi: 'Trong nhiệm kỳ Khóa 1 (2024–2026), VYAB đã trực tiếp triển khai hoạt động tại 4 thành phố nào ở Việt Nam?',
    questionEn: 'Which 4 cities across Viet Nam featured in VYAB Cohort 1 (2024–2026) activities?',
    factVi: 'VYAB đã kết nối hơn 300 lượt bạn trẻ tại Hà Nội, TP. Hồ Chí Minh, Cần Thơ và Đà Nẵng thông qua Green Diplomacy Weeks và Greener Pathways.',
    factEn: 'VYAB engaged 300+ youth across Hanoi, Ho Chi Minh City, Can Tho, and Da Nang through Green Diplomacy Weeks and Greener Pathways.',
    options: [
      { id: 'a', labelVi: 'Hà Nội, Hải Phòng, Huế, Nha Trang', labelEn: 'Hanoi, Hai Phong, Hue, Nha Trang', isCorrect: false, pillar: 'connect' },
      { id: 'b', labelVi: 'Hà Nội, TP.HCM, Cần Thơ, Đà Nẵng', labelEn: 'Hanoi, HCMC, Can Tho, Da Nang', isCorrect: true, pillar: 'connect' },
      { id: 'c', labelVi: 'Hà Nội, Đà Lạt, Vũng Tàu, Quy Nhơn', labelEn: 'Hanoi, Da Lat, Vung Tau, Quy Nhon', isCorrect: false, pillar: 'empower' },
    ],
  },
  {
    id: 'q3',
    questionVi: 'Trên trường quốc tế, VYAB đã đóng góp tiếng nói thanh niên Việt Nam vào đối thoại chính sách tại 3 thành phố nào?',
    questionEn: 'In which 3 international cities did VYAB contribute directly to EU–ASEAN and Global Gateway policy dialogues?',
    factVi: 'Từ Brussels (Global Gateway), Kuala Lumpur (Kỹ năng xanh & học thuật) đến Manila (50 năm EU–ASEAN), tiếng nói Việt Nam đã lan tỏa mạnh mẽ.',
    factEn: 'From Brussels (Global Gateway) and Kuala Lumpur (green skills) to Manila (50th Anniversary EU–ASEAN talks), VYAB brought local voices global.',
    options: [
      { id: 'a', labelVi: 'Brussels, Kuala Lumpur và Manila', labelEn: 'Brussels, Kuala Lumpur, and Manila', isCorrect: true, pillar: 'engage' },
      { id: 'b', labelVi: 'Paris, Bangkok và Jakarta', labelEn: 'Paris, Bangkok, and Jakarta', isCorrect: false, pillar: 'connect' },
      { id: 'c', labelVi: 'Berlin, Singapore và Tokyo', labelEn: 'Berlin, Singapore, and Tokyo', isCorrect: false, pillar: 'empower' },
    ],
  },
  {
    id: 'q4',
    questionVi: 'Hội đồng Thanh niên Toàn cầu của EU (INTPA Global YSB) có bao nhiêu thành viên trẻ (20–30 tuổi) cố vấn cho Ủy viên EU?',
    questionEn: 'How many young members (ages 20–30) serve on the EU INTPA Global Youth Sounding Board?',
    factVi: '25 thành viên toàn cầu nhiệm kỳ 2 năm tình nguyện — trong đó Phó Chủ tịch VYAB Huỳnh Gia Bảo là đại diện từ Việt Nam nhiệm kỳ 2026–2028.',
    factEn: '25 global members serve a voluntary two-year mandate — including VYAB VP Huynh Gia Bao representing Viet Nam for 2026–2028.',
    options: [
      { id: 'a', labelVi: '12 thành viên', labelEn: '12 members', isCorrect: false, pillar: 'engage' },
      { id: 'b', labelVi: '25 thành viên', labelEn: '25 members', isCorrect: true, pillar: 'empower' },
      { id: 'c', labelVi: '50 thành viên', labelEn: '50 members', isCorrect: false, pillar: 'connect' },
    ],
  },
  {
    id: 'q5',
    questionVi: 'Nếu bạn đồng hành cùng VYAB hôm nay, hoạt động nào khiến bạn hào hứng tham gia nhất?',
    questionEn: 'If you join a VYAB initiative today, which action excites you most?',
    factVi: 'Mỗi lựa chọn phản ánh thế mạnh hành động riêng của bạn trong hệ sinh thái Engage · Empower · Connect!',
    factEn: 'Every choice reflects your unique changemaker archetype within Engage, Empower, and Connect!',
    options: [
      {
        id: 'a',
        labelVi: 'Tham vấn chính sách khí hậu & phát triển bền vững cùng Phái đoàn EU',
        labelEn: 'Co-designing climate & sustainability policy consultations with the EU Delegation',
        isCorrect: true,
        pillar: 'engage',
      },
      {
        id: 'b',
        labelVi: 'Khởi nghiệp xanh, học kỹ năng ESG và chuyển đổi số thực chiến',
        labelEn: 'Launching green startups, ESG masterclasses, and practical digital skills',
        isCorrect: true,
        pillar: 'empower',
      },
      {
        id: 'c',
        labelVi: 'Kết nối sinh viên các tỉnh thành với mạng lưới Erasmus+ & thanh niên ASEAN',
        labelEn: 'Connecting regional youth with Erasmus+ alumni & ASEAN youth networks',
        isCorrect: true,
        pillar: 'connect',
      },
    ],
  },
];

export const INITIAL_VOICE_NOTES: VoiceNote[] = [
  {
    id: 'vn-1',
    author: 'Minh Khôi',
    city: 'Cần Thơ',
    topic: 'Kỹ năng Xanh',
    pillar: 'empower',
    message: 'Mong có thêm các khóa thực tập và cố vấn việc làm xanh tại ĐBSCL để sinh viên nông nghiệp ứng dụng công nghệ tuần hoàn ngay từ năm 3.',
    votes: 18,
    createdAt: '27/11/2026',
  },
  {
    id: 'vn-2',
    author: 'Thảo Vy',
    city: 'Đà Nẵng',
    topic: 'Học bổng & Kết nối EU–ASEAN',
    pillar: 'connect',
    message: 'Hy vọng mạng lưới cựu sinh viên Erasmus+ tổ chức thêm buổi mentoring 1-1 cho các bạn trẻ miền Trung quan tâm tới kinh tế biển xanh.',
    votes: 14,
    createdAt: '27/11/2026',
  },
  {
    id: 'vn-3',
    author: 'Hoàng Nam',
    city: 'Hà Nội',
    topic: 'Chuyển đổi Số',
    pillar: 'engage',
    message: 'Cần có diễn đàn thanh niên định kỳ về an toàn số và AI có trách nhiệm trong hợp tác EU–Việt Nam giai đoạn 2026–2028.',
    votes: 22,
    createdAt: '27/11/2026',
  },
  {
    id: 'vn-4',
    author: 'Lan Anh',
    city: 'TP. Hồ Chí Minh',
    topic: 'Khởi nghiệp Bền vững',
    pillar: 'empower',
    message: 'Rất ấn tượng với Global Gateway! Mong có quỹ ươm mầm tài chính xanh dành riêng cho các dự án khởi nghiệp do người trẻ dưới 30 tuổi dẫn dắt.',
    votes: 16,
    createdAt: '27/11/2026',
  },
];

export const POLL_OPTIONS: PollOption[] = [
  {
    id: 'poll-green-skills',
    pillar: 'empower',
    titleVi: 'Đầu tư đào tạo Kỹ năng Xanh & Việc làm Xanh',
    titleEn: 'Invest in Green Skills Training & Green Careers',
    descVi: 'Năng lượng tái tạo, kinh tế tuần hoàn và nông nghiệp bền vững cho sinh viên toàn quốc.',
    descEn: 'Renewable energy, circular economy, and sustainable agriculture programmes nationwide.',
    baseVotes: 42,
  },
  {
    id: 'poll-green-startup',
    pillar: 'empower',
    titleVi: 'Tăng tốc Khởi nghiệp Xanh dưới sáng kiến Global Gateway',
    titleEn: 'Accelerate Youth Green Entrepreneurship under Global Gateway',
    descVi: 'Cố vấn chuyên sâu và mở rộng tiếp cận tài chính xanh cho doanh nghiệp do thanh niên dẫn dắt.',
    descEn: 'Dedicated tracks, mentorship, and green finance access for youth-led green enterprises.',
    baseVotes: 35,
  },
  {
    id: 'poll-regional-access',
    pillar: 'connect',
    titleVi: 'Mở rộng cơ hội giáo dục EU & Erasmus+ ra ngoài các đô thị lớn',
    titleEn: 'Expand EU Education & Erasmus+ Mentoring Beyond Major Cities',
    descVi: 'Đưa cố vấn đồng đẳng và học bổng Châu Âu tới thanh niên Cần Thơ, Đà Nẵng và các tỉnh thành.',
    descEn: 'Bring peer mentoring and EU programmes to youth in Can Tho, Da Nang, and provincial regions.',
    baseVotes: 38,
  },
  {
    id: 'poll-digital-safety',
    pillar: 'engage',
    titleVi: 'Năng lực Số & Sử dụng Công nghệ có Trách nhiệm',
    titleEn: 'Digital Literacy, Safety & Responsible Technology Use',
    descVi: 'Tích hợp kỹ năng an toàn số vào chương trình thanh niên và truyền thông thân thiện với giới trẻ.',
    descEn: 'Integrate digital safety into youth skills programmes and youth-friendly EU outreach.',
    baseVotes: 24,
  },
  {
    id: 'poll-asean-network',
    pillar: 'connect',
    titleVi: 'Kết nối VYAB với Mạng lưới Thanh niên ASEAN & Toàn cầu (GYSB)',
    titleEn: 'Connect VYAB with ASEAN & Global YSB Networks',
    descVi: 'Chương trình trao đổi, đồng nghiên cứu và đối thoại chính sách song phương EU–ASEAN.',
    descEn: 'Exchange programmes, joint events, and shared youth policy research across ASEAN and EU.',
    baseVotes: 29,
  },
];
