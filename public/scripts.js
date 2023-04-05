const videoInput = document.getElementById('video-input');
const uploadBtn = document.getElementById('upload-btn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const videoPreview = document.getElementById('video-preview');
const rangeStart = document.getElementById('range-start');
const rangeEnd = document.getElementById('range-end');
const jointInput = document.getElementById('joint-input');
const completeBtn = document.getElementById('complete-btn');
const videoBarContainer = document.getElementById('video-bar-container');
const videoBar = document.getElementById('video-bar');
const videoBarSelectionStart = document.getElementById('video-bar-selection-start');
const videoBarSelectionEnd = document.getElementById('video-bar-selection-end');
const addBtn = document.getElementById('add-btn');
const selectionsContainer = document.getElementById('selections-container');

let activeSelectionHandle = null;

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

videoBarSelectionStart.addEventListener('mousedown', (e) => {
    e.preventDefault();
    activeSelectionHandle = videoBarSelectionStart;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

videoBarSelectionEnd.addEventListener('mousedown', (e) => {
    e.preventDefault();
    activeSelectionHandle = videoBarSelectionEnd;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

addBtn.addEventListener('click', () => {
    const startTime = parseFloat(videoBarSelectionStart.getAttribute('data-time'));
    const endTime = parseFloat(videoBarSelectionEnd.getAttribute('data-time'));
    const importantJoint = jointInput.value;

    const selection = { startTime, endTime, importantJoint };
    selections.push(selection);

    const selectionElement = document.createElement('div');
    selectionElement.textContent = `시작: ${startTime.toFixed(2)}초, 끝: ${endTime.toFixed(2)}초, 관절: ${importantJoint}`;
    selectionsContainer.appendChild(selectionElement);
});

let selections = [];

videoBar.addEventListener('click', (e) => {
    const videoBarRect = videoBar.getBoundingClientRect();
    const mouseX = e.clientX;
    const videoDuration = videoPreview.duration;

    const timePercentage = ((mouseX - videoBarRect.left) / videoBarRect.width) * 100;
    const timeInSeconds = (timePercentage * videoDuration) / 100;

    videoPreview.currentTime = timeInSeconds;
});

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

function onMouseMove(event) {
    const videoBarRect = videoBar.getBoundingClientRect();
    const mouseX = event.clientX;
    const videoDuration = videoPreview.duration;

    const timePercentage = ((mouseX - videoBarRect.left) / videoBarRect.width) * 100;
    const timeInSeconds = (timePercentage * videoDuration) / 100;

    if (timePercentage < 0) {
        activeSelectionHandle.style.left = '0%';
    } else if (timePercentage > 100) {
        activeSelectionHandle.style.left = '100%';
    } else {
        activeSelectionHandle.style.left = timePercentage + '%';
        activeSelectionHandle.setAttribute('data-time', timeInSeconds);
    }
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

videoPreview.addEventListener('timeupdate', () => {
    const progress = (videoPreview.currentTime / videoPreview.duration) * 100;
    videoBar.style.width = progress + '%';
});

videoBarContainer.addEventListener('click', (e) => {
    const containerWidth = videoBarContainer.clientWidth;
    const position = e.offsetX / containerWidth;
    videoPreview.currentTime = position * videoPreview.duration;
});

videoBarSelection.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});
