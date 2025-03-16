import type { Course } from '@/types/schedule';
import html2canvas from 'html2canvas';

/**
 * 시간표를 이미지로 변환하는 함수
 * @param courses 시간표에 표시할 과목 목록
 * @returns 이미지 URL (Promise)
 */
export const scheduleToImage = async (courses: Course[]): Promise<string> => {
  // 시간표를 렌더링할 임시 요소 생성
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.left = '-9999px';
  tempElement.style.width = '800px';
  tempElement.style.height = '600px';
  tempElement.style.backgroundColor = '#0d2d84';
  tempElement.style.padding = '20px';
  tempElement.style.borderRadius = '16px';
  
  // 요일 목록
  const days = ['월', '화', '수', '목', '금', '토'];
  
  // 시간표 HTML 생성
  let tableHTML = `
    <div style="font-family: sans-serif; color: white;">
      <h2 style="margin-bottom: 16px; font-size: 20px; text-align: center;">내 시간표</h2>
      <div style="display: grid; grid-template-columns: 60px repeat(6, 1fr); gap: 4px;">
        <div style="text-align: center; padding: 8px; font-size: 14px;">시간</div>
  `;
  
  // 요일 헤더 추가
  days.forEach(day => {
    tableHTML += `<div style="text-align: center; padding: 8px; font-weight: bold; font-size: 16px;">${day}</div>`;
  });
  
  // 시간 슬롯 생성 (9시부터 22시까지)
  for (let hour = 9; hour <= 22; hour++) {
    tableHTML += `
      <div style="text-align: center; padding: 8px; font-size: 12px;">${hour}:00</div>
    `;
    
    // 각 요일 셀 추가
    for (let dayIndex = 0; dayIndex < 6; dayIndex++) {
      const coursesAtTime = courses.filter(course => {
        const [startHour] = course.startTime.split(':').map(Number);
        const [endHour] = course.endTime.split(':').map(Number);
        return course.dayOfWeek === dayIndex && startHour <= hour && endHour > hour;
      });
      
      if (coursesAtTime.length > 0) {
        const course = coursesAtTime[0];
        const [startHour, startMinute] = course.startTime.split(':').map(Number);
        
        // 과목 시작 시간인 경우에만 셀에 내용 표시
        if (startHour === hour && startMinute === 0) {
          tableHTML += `
            <div style="background-color: ${course.color}; border-radius: 8px; padding: 8px; font-size: 12px; overflow: hidden;">
              <div style="font-weight: bold; margin-bottom: 4px;">${course.name}</div>
              ${course.professor ? `<div>${course.professor}</div>` : ''}
              ${course.location ? `<div>${course.location}</div>` : ''}
              <div>${course.startTime} - ${course.endTime}</div>
            </div>
          `;
        } else {
          tableHTML += `<div style="background-color: ${course.color}; opacity: 0.8; border-radius: 0;"></div>`;
        }
      } else {
        tableHTML += `<div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 4px;"></div>`;
      }
    }
  }
  
  tableHTML += `</div></div>`;
  
  // 임시 요소에 HTML 추가
  tempElement.innerHTML = tableHTML;
  document.body.appendChild(tempElement);
  
  try {
    // html2canvas를 사용하여 요소를 캔버스로 변환
    const canvas = await html2canvas(tempElement, {
      backgroundColor: '#0d2d84',
      scale: 2, // 고해상도
    });
    
    // 캔버스를 이미지 URL로 변환
    const imageUrl = canvas.toDataURL('image/png');
    return imageUrl;
  } catch (error) {
    console.error('시간표 이미지 생성 실패:', error);
    throw error;
  } finally {
    // 임시 요소 제거
    document.body.removeChild(tempElement);
  }
}; 