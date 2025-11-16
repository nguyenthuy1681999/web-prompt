const defaultConfig = {
    site_title: "Trình Tạo Prompt Infographic AI",
    site_description: "Tạo prompt chuyên nghiệp cho ChatGPT để sinh infographic đẹp mắt và hiệu quả",
    generate_button_text: "🚀 Tạo Prompt Infographic"
};

let currentTab = 'education';
let selectedTypes = {
    education: null,
    communication: null
};

// Show initial notice
document.addEventListener('DOMContentLoaded', function () {
    const eduNotice = document.getElementById('edu-form-notice');
    if (eduNotice) {
        eduNotice.style.display = 'block';
        eduNotice.classList.add('show');
    }
});

function switchTab(tabName, event) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');

    currentTab = tabName;

    // Show notice if no type selected for this tab
    if (!selectedTypes[tabName]) {
        const notice = document.getElementById(`${tabName}-form-notice`);
        if (notice) {
            notice.style.display = 'block';
            notice.classList.add('show');
        }
    }
}

// function selectType(tab, type) {
//     // Ẩn tất cả form riêng của tab hiện tại
//     document.querySelectorAll(`#${tab}-form .type-specific-form`).forEach(form => {
//         form.style.display = "none";
//     });

//     // Ẩn thông tin chung
//     const commonForm = document.getElementById(`${tab === 'education' ? 'edu' : 'comm'}-common-form`);
//     if (commonForm) commonForm.style.display = "none";

//     // Ẩn thông báo “Vui lòng chọn dạng…”
//     const notice = document.getElementById(`${tab === 'education' ? 'edu' : 'comm'}-form-notice`);
//     if (notice) notice.style.display = "none";

//     // Hiện form tương ứng
//     const selectedForm = document.getElementById(`${tab === 'education' ? 'edu' : 'comm'}-${type}-form`);
//     if (selectedForm) selectedForm.style.display = "block";
// }

function selectType(tab, type, event) {
    console.log(type);
    // Remove previous selection
    document.querySelectorAll(`#${tab}-tab .type-card`).forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    event.currentTarget.classList.add('selected');
    selectedTypes[tab] = type;

    // Hide notice message
    const notice = document.getElementById(`${tab}-form-notice`);
    if (notice) {
        notice.classList.remove('show');
        setTimeout(() => {
            notice.style.display = 'none';
        }, 300);
    }

    // Hide all type-specific forms for this tab
    document.querySelectorAll(`#${tab}-tab .type-specific-form`).forEach(form => {
        form.style.display = 'none';
    });

    // Show the specific form for selected type
    const idPrefix = tab === "education" ? "edu" : "comm";
    const specificForm = document.getElementById(`${idPrefix}-${type}-form`);
    if (specificForm) {
        specificForm.style.display = "block";
        specificForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function generatePrompt() {
    const selectedType = selectedTypes[currentTab];
    console.log('currentTab', currentTab);
    console.log('selectedTypes', selectedTypes);
    if (!selectedType) {
        alert('Vui lòng chọn dạng infographic trước!');
        return;
    }

    let prompt = '';

    if (currentTab === 'education') {
        prompt = generateEducationPrompt(selectedType);
    } else {
        prompt = generateCommunicationPrompt(selectedType);
    }

    if (prompt) {
        document.getElementById('promptOutput').textContent = prompt;
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function generateEducationPrompt(type) {
    const topic = document.getElementById('edu-topic').value;
    const audience = document.getElementById('edu-audience').value;
    const objective = document.getElementById('edu-objective').value;
    const color = document.getElementById('edu-color').value;

    if (!topic || !audience || !objective) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return null;
    }

    // Get type-specific data
    let specificData = '';
    if (type === 'timeline') {
        const period = document.getElementById('edu-timeline-period').value;
        const events = document.getElementById('edu-timeline-events').value;
        const trend = document.getElementById('edu-timeline-trend').value;
        specificData = { period, events, trend };
    } else if (type === 'comparison') {
        const item1 = document.getElementById('edu-compare-item1').value;
        const item2 = document.getElementById('edu-compare-item2').value;
        const criteria = document.getElementById('edu-compare-criteria').value;
        const details = document.getElementById('edu-compare-details').value;
        const conclusion = document.getElementById('edu-compare-conclusion').value;
        specificData = { item1, item2, criteria, details, conclusion };
    } else if (type === 'map') {
        const region = document.getElementById('edu-map-region').value;
        const data = document.getElementById('edu-map-data').value;
        const metrics = document.getElementById('edu-map-metrics').value;
        const notes = document.getElementById('edu-map-notes').value;
        specificData = { region, data, metrics, notes };
    } else if (type === 'summary') {
        const dataType = document.getElementById('edu-summary-type').value;
        const data = document.getElementById('edu-summary-data').value;
        const categories = document.getElementById('edu-summary-categories').value;
        const insights = document.getElementById('edu-summary-insights').value;
        const source = document.getElementById('edu-summary-source').value;
        specificData = { dataType, data, categories, insights, source };
    }
    console.log(specificData);
    const typeTemplates = {
        timeline: `Tạo infographic dạng timeline về "${topic}" với các yêu cầu sau:

🎯 MỤC TIÊU: ${objective}
👥 ĐỐI TƯỢNG: ${audience}
🎨 MÀU SẮC: ${color || 'phù hợp với chủ đề'}

⏰ THÔNG TIN TIMELINE:
- Khoảng thời gian: ${specificData.period || 'Chưa xác định'}
- Các mốc quan trọng:
${specificData.events || 'Chưa có thông tin chi tiết'}
- Xu hướng/Kết luận: ${specificData.trend || 'Chưa có phân tích'}

📋 YÊU CẦU THIẾT KẾ:
- Bố cục timeline rõ ràng, dễ theo dõi từ trái sang phải hoặc từ trên xuống dưới
- Sử dụng icon và biểu tượng phù hợp cho từng mốc thời gian
- Thông tin được sắp xếp theo thứ tự thời gian logic
- Highlight các mốc quan trọng với màu sắc nổi bật
- Đường timeline rõ ràng, có điểm đánh dấu
- Phù hợp với trình độ hiểu biết của ${audience}
- Tông màu ${color || 'chuyên nghiệp và dễ nhìn'}

📐 ĐỊNH DẠNG: Infographic dọc, tỷ lệ 3:4, độ phân giải cao, phù hợp chia sẻ mạng xã hội`,

        comparison: `Tạo infographic so sánh về "${topic}" với các yêu cầu sau:

🎯 MỤC TIÊU: ${objective}
👥 ĐỐI TƯỢNG: ${audience}
🎨 MÀU SẮC: ${color || 'phù hợp với chủ đề'}

⚖️ THÔNG TIN SO SÁNH:
- Đối tượng 1: ${specificData.item1 || 'Chưa xác định'}
- Đối tượng 2: ${specificData.item2 || 'Chưa xác định'}
- Tiêu chí so sánh:
${specificData.criteria || 'Chưa có tiêu chí cụ thể'}
- Chi tiết ưu/nhược điểm:
${specificData.details || 'Chưa có thông tin chi tiết'}
- Kết luận: ${specificData.conclusion || 'Chưa có kết luận'}

📋 YÊU CẦU THIẾT KẾ:
- Bố cục đối xứng, cân bằng giữa hai bên so sánh
- Sử dụng bảng, biểu đồ để làm rõ sự khác biệt
- Highlight ưu/nhược điểm rõ ràng với màu xanh/đỏ
- Icon và màu sắc phân biệt rõ ràng giữa hai nhóm
- Phần kết luận nổi bật ở cuối
- Dễ hiểu và so sánh nhanh cho ${audience}
- Tông màu ${color || 'chuyên nghiệp với màu phân biệt'}

📐 ĐỊNH DẠNG: Infographic ngang hoặc dọc, bố cục split-screen, độ phân giải cao`,

        map: `Tạo infographic bản đồ về "${topic}" với các yêu cầu sau:

🎯 MỤC TIÊU: ${objective}
👥 ĐỐI TƯỢNG: ${audience}
🎨 MÀU SẮC: ${color || 'phù hợp với chủ đề'}

🗺️ THÔNG TIN BẢN ĐỒ:
- Khu vực: ${specificData.region || 'Chưa xác định'}
- Dữ liệu theo vùng:
${specificData.data || 'Chưa có dữ liệu chi tiết'}
- Chỉ số hiển thị: ${specificData.metrics || 'Chưa xác định'}
- Ghi chú đặc biệt: ${specificData.notes || 'Không có'}

📋 YÊU CẦU THIẾT KẾ:
- Bản đồ ${specificData.region || 'khu vực'} rõ nét, dễ nhận diện ranh giới
- Sử dụng màu sắc gradient hoặc ký hiệu phân biệt các khu vực
- Thông tin số liệu được đặt hợp lý trên bản đồ
- Legend/chú thích đầy đủ và dễ hiểu
- Callout boxes cho thông tin quan trọng
- Phù hợp với trình độ địa lý của ${audience}
- Tông màu ${color || 'chuyên nghiệp và dễ phân biệt'}

📐 ĐỊNH DẠNG: Infographic theo tỷ lệ bản đồ, có thể ngang hoặc dọc, độ phân giải cao`,

        summary: `Tạo infographic tổng hợp về "${topic}" với các yêu cầu sau:

🎯 MỤC TIÊU: ${objective}
👥 ĐỐI TƯỢNG: ${audience}
🎨 MÀU SẮC: ${color || 'phù hợp với chủ đề'}

📊 THÔNG TIN TỔNG HỢP:
- Loại dữ liệu: ${specificData.dataType || 'Chưa xác định'}
- Số liệu chính:
${specificData.data || 'Chưa có số liệu cụ thể'}
- Phân loại dữ liệu: ${specificData.categories || 'Chưa phân loại'}
- Insight quan trọng: ${specificData.insights || 'Chưa có phân tích'}
- Nguồn: ${specificData.source || 'Chưa xác định nguồn'}

📋 YÊU CẦU THIẾT KẾ:
- Sử dụng biểu đồ phù hợp: cột, tròn, đường, donut chart
- Thông tin được nhóm theo chủ đề logic với headers rõ ràng
- Highlight số liệu quan trọng với font size lớn và màu nổi bật
- Sử dụng icon và infographic elements phù hợp
- Phần insight/kết luận nổi bật
- Nguồn dữ liệu được ghi rõ ở cuối
- Dễ đọc và hiểu cho ${audience}
- Tông màu ${color || 'chuyên nghiệp và khoa học'}

📐 ĐỊNH DẠNG: Infographic dọc, bố cục grid system, tỷ lệ 3:4, độ phân giải cao`
    };

    return typeTemplates[type];
}

function generateCommunicationPrompt(type) {
    const event = document.getElementById('comm-event').value;
    const audience = document.getElementById('comm-audience').value;
    const cta = document.getElementById('comm-cta').value;
    const style = document.getElementById('comm-style').value;

    if (!event || !audience) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return null;
    }

    // Get type-specific data
    let specificData = '';
    if (type === 'news') {
        const headline = document.getElementById('comm-news-headline').value;
        const content = document.getElementById('comm-news-content').value;
        const date = document.getElementById('comm-news-date').value;
        const impact = document.getElementById('comm-news-impact').value;
        const contact = document.getElementById('comm-news-contact').value;
        specificData = { headline, content, date, impact, contact };
    } else if (type === 'timeline') {
        const duration = document.getElementById('comm-timeline-duration').value;
        const schedule = document.getElementById('comm-timeline-schedule').value;
        const venue = document.getElementById('comm-timeline-venue').value;
        const speakers = document.getElementById('comm-timeline-speakers').value;
        const activities = document.getElementById('comm-timeline-activities').value;
        specificData = { duration, schedule, venue, speakers, activities };
    } else if (type === 'profile') {
        const name = document.getElementById('comm-profile-name').value;
        const position = document.getElementById('comm-profile-position').value;
        const achievements = document.getElementById('comm-profile-achievements').value;
        const experience = document.getElementById('comm-profile-experience').value;
        const contact = document.getElementById('comm-profile-contact').value;
        const quote = document.getElementById('comm-profile-quote').value;
        specificData = { name, position, achievements, experience, contact, quote };
    }

    const typeTemplates = {
        news: `Tạo infographic tin tức về "${event}" với các yêu cầu sau:

📢 SỰ KIỆN: ${event}
👥 ĐỐI TƯỢNG: ${audience}
🎨 PHONG CÁCH: ${style || 'hiện đại, chuyên nghiệp'}

📰 THÔNG TIN TIN TỨC:
- Tiêu đề chính: ${specificData.headline || 'Chưa có tiêu đề'}
- Nội dung: ${specificData.content || 'Chưa có nội dung chi tiết'}
- Thời gian: ${specificData.date || 'Chưa xác định'}
- Tác động/Ý nghĩa: ${specificData.impact || 'Chưa có thông tin'}
- Liên hệ: ${specificData.contact || 'Chưa có thông tin liên hệ'}

🎯 CALL-TO-ACTION: ${cta || 'Tham gia ngay'}

📋 YÊU CẦU THIẾT KẾ:
- Tiêu đề "${specificData.headline || event}" nổi bật, font size lớn
- Layout tin tức với header, body, footer rõ ràng
- Sử dụng icon tin tức, breaking news elements
- Highlight thông tin quan trọng (thời gian, tác động)
- CTA button nổi bật với màu sắc thu hút
- Thông tin liên hệ dễ thấy
- Phong cách ${style || 'hiện đại và chuyên nghiệp'}
- Phù hợp với ${audience}

📐 ĐỊNH DẠNG: Infographic vuông hoặc dọc, tỷ lệ 1:1 hoặc 3:4, phù hợp social media`,

        timeline: `Tạo infographic timeline cho "${event}" với các yêu cầu sau:

📅 CHƯƠNG TRÌNH: ${event}
👥 ĐỐI TƯỢNG: ${audience}
🎨 PHONG CÁCH: ${style || 'hiện đại, chuyên nghiệp'}

📅 THÔNG TIN TIMELINE:
- Thời gian tổng thể: ${specificData.duration || 'Chưa xác định'}
- Lịch trình chi tiết:
${specificData.schedule || 'Chưa có lịch trình cụ thể'}
- Địa điểm: ${specificData.venue || 'Chưa xác định'}
- Diễn giả/Khách mời: ${specificData.speakers || 'Chưa có thông tin'}
- Hoạt động đặc biệt: ${specificData.activities || 'Chưa có thông tin'}

🎯 CALL-TO-ACTION: ${cta || 'Đăng ký tham gia'}

📋 YÊU CẦU THIẾT KẾ:
- Timeline dọc hoặc ngang với thời gian cụ thể
- Các hoạt động được sắp xếp theo thứ tự thời gian
- Icon và màu sắc phân biệt từng phần/ngày
- Highlight diễn giả và hoạt động đặc biệt
- Thông tin địa điểm và đăng ký rõ ràng
- Phong cách ${style || 'hiện đại và năng động'}
- Thu hút và phù hợp với ${audience}

📐 ĐỊNH DẠNG: Infographic dọc, timeline layout, tỷ lệ 3:4, độ phân giải cao`,

        profile: `Tạo infographic profile cho "${specificData.name || event}" với các yêu cầu sau:

👤 PROFILE: ${specificData.name || event}
👥 ĐỐI TƯỢNG: ${audience}
🎨 PHONG CÁCH: ${style || 'chuyên nghiệp, uy tín'}

👤 THÔNG TIN PROFILE:
- Tên: ${specificData.name || 'Chưa xác định'}
- Chức vụ/Vai trò: ${specificData.position || 'Chưa xác định'}
- Thành tích nổi bật:
${specificData.achievements || 'Chưa có thông tin thành tích'}
- Kinh nghiệm/Lĩnh vực: ${specificData.experience || 'Chưa có thông tin'}
- Liên hệ: ${specificData.contact || 'Chưa có thông tin liên hệ'}
- Quote: ${specificData.quote || 'Không có'}

🎯 CALL-TO-ACTION: ${cta || 'Tìm hiểu thêm'}

📋 YÊU CẦU THIẾT KẾ:
- Layout profile card với avatar/photo placeholder
- Thông tin được nhóm theo sections: About, Achievements, Experience
- Highlight thành tích nổi bật với icons và số liệu
- Quote/câu nói được thiết kế đặc biệt nếu có
- Thông tin liên hệ (social media icons) dễ thấy
- Professional headshot area hoặc company logo space
- Phong cách ${style || 'chuyên nghiệp và uy tín'}
- Tạo ấn tượng tốt với ${audience}

📐 ĐỊNH DẠNG: Infographic dọc hoặc vuông, layout card-based, tỷ lệ phù hợp với profile`
    };

    return typeTemplates[type];
}

function copyPrompt() {
    const promptText = document.getElementById('promptOutput').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Đã sao chép!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    });
}

// Element SDK Integration
async function onConfigChange(config) {
    const siteTitle = document.getElementById('siteTitle');
    const siteDescription = document.getElementById('siteDescription');
    const generateBtnText = document.getElementById('generateBtnText');

    if (siteTitle) {
        siteTitle.textContent = config.site_title || defaultConfig.site_title;
    }
    if (siteDescription) {
        siteDescription.textContent = config.site_description || defaultConfig.site_description;
    }
    if (generateBtnText) {
        generateBtnText.textContent = config.generate_button_text || defaultConfig.generate_button_text;
    }
}

function mapToCapabilities(config) {
    return {
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
    };
}

function mapToEditPanelValues(config) {
    return new Map([
        ["site_title", config.site_title || defaultConfig.site_title],
        ["site_description", config.site_description || defaultConfig.site_description],
        ["generate_button_text", config.generate_button_text || defaultConfig.generate_button_text]
    ]);
}

// Initialize Element SDK
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
    });
}
