const videoInput = document.getElementById('video-input');
const uploadBtn = document.getElementById('upload-btn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const videoPreview = document.getElementById('video-preview');
const jointInput = document.getElementById('joint-input');
const completeBtn = document.getElementById('complete-btn');
const addBtn = document.getElementById('add-btn');
const selectionsContainer = document.getElementById('selections-container');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');

let startTime = 0;
let endTime = 0;

startBtn.addEventListener('click', () => {
    startTime = videoPreview.currentTime;
});

endBtn.addEventListener('click', () => {
    endTime = videoPreview.currentTime;
});

addBtn.addEventListener('click', () => {
    if (startTime >= endTime) {
        alert('시작 시각이 종료 시각보다 빨라야 합니다.');
        return;
    }

    const importantJoint = jointInput.value;

    const selection = { startTime, endTime, importantJoint };
    selections.push(selection);

    const selectionElement = document.createElement('div');
    selectionElement.textContent = `시작: ${startTime.toFixed(2)}초, 끝: ${endTime.toFixed(2)}초, 관절: ${importantJoint}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => {
        const index = selections.indexOf(selection);
        if (index > -1) {
            selections.splice(index, 1);
        }
        selectionsContainer.removeChild(selectionElement);
    });

    selectionElement.appendChild(deleteBtn);
    selectionsContainer.appendChild(selectionElement);
});

uploadBtn.addEventListener('click', () => {
    if (videoInput.files.length === 0) {
        alert('동영상을 선택해주세요.');
        return;
    }

    const formData = new FormData();
    formData.append('video', videoInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(() => {
        page1.style.display = 'none';
        page2.style.display = 'block';

        videoPreview.src = URL.createObjectURL(videoInput.files[0]);
        videoPreview.addEventListener('loadedmetadata', () => {
            rangeStart.max = videoPreview.duration;
            rangeEnd.max = videoPreview.duration;
        });
    });
});

let selections = [];

// 완료 버튼 클릭 이벤트 리스너
completeBtn.addEventListener('click', () => {
    // CSV 파일로 저장
    const csvData = 'Start Time,End Time,Joint\n' + selections.map(selection => `${selection.startTime},${selection.endTime},${selection.importantJoint}`).join('\n');

    // Blob 객체 생성 (UTF-8 BOM 추가)
    const utf8BOM = '\uFEFF';
    const blob = new Blob([utf8BOM + csvData], { type: 'text/csv;charset=utf-8;' });

    // 사용자 컴퓨터에 저장
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'joint-data.csv';
    a.click();
    URL.revokeObjectURL(url);

    // 완료되었습니다 알림
    alert('완료되었습니다.');
});
