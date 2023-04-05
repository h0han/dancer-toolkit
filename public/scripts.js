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
const videoBarSelection = document.getElementById('video-bar-selection');

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

completeBtn.addEventListener('click', () => {
    const currentTime = videoPreview.currentTime;
    const importantJoint = jointInput.value;

    // CSV 파일로 저장
    const csvData = `Time,Joint\n${currentTime},${importantJoint}`;

    // Blob 객체 생성
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

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

function onMouseMove(e) {
    const containerLeft = videoBarContainer.getBoundingClientRect().left;
    const containerWidth = videoBarContainer.clientWidth;
    let position = (e.clientX - containerLeft) / containerWidth;

    position = Math.max(0, Math.min(1, position));

    videoBarSelection.style.left = position * 100 + '%';
    videoPreview.currentTime = position * videoPreview.duration;
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    const currentTime = videoPreview.currentTime;
    const importantJoint = jointInput.value;

    // CSV 파일로 저장
    const csvData = `Time,Joint\n${currentTime},${importantJoint}`;

    // Blob 객체 생성
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // 사용자 컴퓨터에 저장
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'joint-data.csv';
    a.click();
    URL.revokeObjectURL(url);
}
