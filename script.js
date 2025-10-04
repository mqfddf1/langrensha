// 狼人杀法官助手 - 主要功能实现
class WerewolfGame {
    constructor() {
        this.currentRoom = null;
        this.currentPlayer = null;
        this.players = [];
        this.gameState = 'waiting'; // waiting, playing, ended
        this.currentPhase = 'waiting';
        this.currentDay = 1;
        this.timer = null;
        this.timeLeft = 0;
        this.isHost = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkUrlParams();
        this.showPage('mainPage');
    }

    bindEvents() {
        // 主页面按钮
        document.getElementById('createRoomBtn').addEventListener('click', () => this.showPage('createRoomPage'));
        document.getElementById('joinRoomBtn').addEventListener('click', () => this.showPage('joinRoomPage'));
        document.getElementById('rulesBtn').addEventListener('click', () => this.showPage('rulesPage'));

        // 返回按钮
        document.getElementById('backToMainBtn').addEventListener('click', () => this.showPage('mainPage'));
        document.getElementById('backToMainBtn2').addEventListener('click', () => this.showPage('mainPage'));
        document.getElementById('backToMainBtn3').addEventListener('click', () => this.showPage('mainPage'));

        // 创建房间
        document.getElementById('confirmCreateBtn').addEventListener('click', () => this.createRoom());

        // 加入房间
        document.getElementById('confirmJoinBtn').addEventListener('click', () => this.joinRoom());

        // 房间操作
        document.getElementById('shareRoomBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('exitRoomBtn').addEventListener('click', () => this.exitRoom());
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());

        // 游戏控制
        document.getElementById('nextPhaseBtn').addEventListener('click', () => this.nextPhase());
        document.getElementById('endGameBtn').addEventListener('click', () => this.endGame());

        // 模态框
        document.getElementById('closeShareModal').addEventListener('click', () => this.hideShareModal());
        document.getElementById('copyLinkBtn').addEventListener('click', () => this.copyShareLink());

        // 输入框回车事件
        document.getElementById('roomName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createRoom();
        });
        document.getElementById('playerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createRoom();
        });
        document.getElementById('roomCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinRoom();
        });
        document.getElementById('joinPlayerName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinRoom();
        });

        // 点击模态框外部关闭
        document.getElementById('shareModal').addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') {
                this.hideShareModal();
            }
        });
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const roomCode = urlParams.get('room');
        const playerName = urlParams.get('name');
        
        if (roomCode) {
            document.getElementById('roomCode').value = roomCode;
            if (playerName) {
                document.getElementById('joinPlayerName').value = playerName;
                this.showPage('joinRoomPage');
            } else {
                this.showPage('joinRoomPage');
            }
        }
    }

    showPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标页面
        document.getElementById(pageId).classList.add('active');
        
        // 特殊处理
        if (pageId === 'gameRoomPage') {
            this.updateGameRoom();
        } else if (pageId === 'gamePlayPage') {
            this.updateGamePlay();
        }
    }

    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    createRoom() {
        const roomName = document.getElementById('roomName').value.trim();
        const playerName = document.getElementById('playerName').value.trim();
        const maxPlayers = parseInt(document.getElementById('maxPlayers').value);

        if (!roomName) {
            this.showNotification('请输入房间名称', 'error');
            return;
        }

        if (!playerName) {
            this.showNotification('请输入您的昵称', 'error');
            return;
        }

        if (playerName.length > 10) {
            this.showNotification('昵称不能超过10个字符', 'error');
            return;
        }

        // 创建房间
        const roomCode = this.generateRoomCode();
        this.currentRoom = {
            code: roomCode,
            name: roomName,
            maxPlayers: maxPlayers,
            host: playerName,
            createdAt: new Date()
        };

        this.currentPlayer = {
            name: playerName,
            isHost: true,
            isAlive: true,
            role: null
        };

        this.players = [this.currentPlayer];
        this.isHost = true;

        // 更新URL
        this.updateUrl(roomCode, playerName);

        this.showNotification('房间创建成功！', 'success');
        this.showPage('gameRoomPage');
    }

    joinRoom() {
        const roomCode = document.getElementById('roomCode').value.trim().toUpperCase();
        const playerName = document.getElementById('joinPlayerName').value.trim();

        if (!roomCode) {
            this.showNotification('请输入房间号', 'error');
            return;
        }

        if (roomCode.length !== 6) {
            this.showNotification('房间号必须是6位', 'error');
            return;
        }

        if (!playerName) {
            this.showNotification('请输入您的昵称', 'error');
            return;
        }

        if (playerName.length > 10) {
            this.showNotification('昵称不能超过10个字符', 'error');
            return;
        }

        // 模拟加入房间（实际应用中这里会连接服务器）
        this.currentRoom = {
            code: roomCode,
            name: `房间${roomCode}`,
            maxPlayers: 12,
            host: '房主',
            createdAt: new Date()
        };

        this.currentPlayer = {
            name: playerName,
            isHost: false,
            isAlive: true,
            role: null
        };

        // 模拟其他玩家（实际应用中这里会从服务器获取）
        this.players = [
            { name: '房主', isHost: true, isAlive: true, role: null },
            this.currentPlayer
        ];

        this.isHost = false;

        // 更新URL
        this.updateUrl(roomCode, playerName);

        this.showNotification('成功加入房间！', 'success');
        this.showPage('gameRoomPage');
    }

    updateUrl(roomCode, playerName) {
        const url = new URL(window.location);
        url.searchParams.set('room', roomCode);
        url.searchParams.set('name', playerName);
        window.history.pushState({}, '', url);
    }

    updateGameRoom() {
        if (!this.currentRoom) return;

        document.getElementById('currentRoomName').textContent = this.currentRoom.name;
        document.getElementById('currentRoomCode').textContent = this.currentRoom.code;
        document.getElementById('playerCount').textContent = this.players.length;
        document.getElementById('maxPlayerCount').textContent = this.currentRoom.maxPlayers;

        // 更新玩家列表
        this.updatePlayersList();

        // 更新按钮状态
        const startGameBtn = document.getElementById('startGameBtn');
        const kickPlayerBtn = document.getElementById('kickPlayerBtn');
        
        if (this.isHost) {
            startGameBtn.disabled = this.players.length < 4 || this.gameState === 'playing';
            kickPlayerBtn.disabled = this.players.length <= 1;
        } else {
            startGameBtn.style.display = 'none';
            kickPlayerBtn.style.display = 'none';
        }
    }

    updatePlayersList() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.players.forEach((player, index) => {
            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-role">${player.role || '未分配'}</div>
                <div class="player-status ${player.isAlive ? 'alive' : 'dead'}">
                    ${player.isAlive ? '存活' : '死亡'}
                </div>
                ${player.isHost ? '<div style="color: #ff6b6b; font-size: 12px; margin-top: 5px;">房主</div>' : ''}
            `;

            // 如果是房主，可以点击踢出玩家
            if (this.isHost && !player.isHost && this.gameState === 'waiting') {
                playerCard.style.cursor = 'pointer';
                playerCard.addEventListener('click', () => this.kickPlayer(index));
            }

            playersList.appendChild(playerCard);
        });
    }

    kickPlayer(playerIndex) {
        if (!this.isHost || this.gameState === 'playing') return;
        
        const player = this.players[playerIndex];
        if (confirm(`确定要踢出玩家"${player.name}"吗？`)) {
            this.players.splice(playerIndex, 1);
            this.updateGameRoom();
            this.showNotification(`已踢出玩家"${player.name}"`, 'success');
        }
    }

    startGame() {
        if (!this.isHost || this.players.length < 4) return;

        this.gameState = 'playing';
        this.currentDay = 1;
        this.currentPhase = 'night';
        
        // 分配角色（简化版）
        this.assignRoles();
        
        this.showNotification('游戏开始！', 'success');
        this.showPage('gamePlayPage');
    }

    assignRoles() {
        const playerCount = this.players.length;
        const roles = [];

        // 根据人数分配角色
        if (playerCount >= 4 && playerCount <= 6) {
            roles.push('狼人', '狼人', '村民', '村民', '预言家', '女巫');
        } else if (playerCount >= 7 && playerCount <= 9) {
            roles.push('狼人', '狼人', '狼人', '村民', '村民', '村民', '预言家', '女巫', '猎人');
        } else if (playerCount >= 10) {
            roles.push('狼人', '狼人', '狼人', '狼人', '村民', '村民', '村民', '村民', '预言家', '女巫', '猎人', '守卫');
        }

        // 随机分配角色
        const shuffledRoles = roles.sort(() => Math.random() - 0.5);
        this.players.forEach((player, index) => {
            if (index < shuffledRoles.length) {
                player.role = shuffledRoles[index];
            } else {
                player.role = '村民';
            }
        });
    }

    updateGamePlay() {
        if (this.gameState !== 'playing') return;

        document.getElementById('currentDay').textContent = this.currentDay;
        
        const phaseInfo = this.getPhaseInfo();
        document.getElementById('currentPhase').textContent = phaseInfo.title;
        document.getElementById('phaseDescription').textContent = phaseInfo.description;

        // 更新按钮状态
        const nextPhaseBtn = document.getElementById('nextPhaseBtn');
        const endGameBtn = document.getElementById('endGameBtn');
        
        if (this.isHost) {
            nextPhaseBtn.disabled = false;
            endGameBtn.disabled = false;
        } else {
            nextPhaseBtn.style.display = 'none';
            endGameBtn.style.display = 'none';
        }
    }

    getPhaseInfo() {
        const phases = {
            'night': {
                title: '夜晚阶段',
                description: '狼人请选择要击杀的目标，其他角色请使用技能'
            },
            'morning': {
                title: '白天阶段',
                description: '公布昨晚的死亡情况，开始讨论'
            },
            'voting': {
                title: '投票阶段',
                description: '请投票选出要放逐的玩家'
            },
            'result': {
                title: '结果阶段',
                description: '公布投票结果，被放逐的玩家请发表遗言'
            }
        };

        return phases[this.currentPhase] || phases['night'];
    }

    nextPhase() {
        if (!this.isHost || this.gameState !== 'playing') return;

        const phaseOrder = ['night', 'morning', 'voting', 'result'];
        const currentIndex = phaseOrder.indexOf(this.currentPhase);
        
        if (currentIndex < phaseOrder.length - 1) {
            this.currentPhase = phaseOrder[currentIndex + 1];
        } else {
            // 进入下一天
            this.currentDay++;
            this.currentPhase = 'night';
        }

        this.updateGamePlay();
        this.showNotification(`进入${this.getPhaseInfo().title}`, 'success');
    }

    endGame() {
        if (!this.isHost) return;

        if (confirm('确定要结束游戏吗？')) {
            this.gameState = 'ended';
            this.showNotification('游戏已结束', 'success');
            this.showPage('gameRoomPage');
        }
    }

    showShareModal() {
        if (!this.currentRoom) return;

        document.getElementById('shareRoomCode').textContent = this.currentRoom.code;
        
        const shareLink = `${window.location.origin}${window.location.pathname}?room=${this.currentRoom.code}&name=${encodeURIComponent(this.currentPlayer.name)}`;
        document.getElementById('shareLink').value = shareLink;
        
        document.getElementById('shareModal').classList.add('active');
    }

    hideShareModal() {
        document.getElementById('shareModal').classList.remove('active');
    }

    copyShareLink() {
        const shareLinkInput = document.getElementById('shareLink');
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // 移动端兼容

        try {
            document.execCommand('copy');
            this.showNotification('链接已复制到剪贴板', 'success');
        } catch (err) {
            // 使用现代API
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                this.showNotification('链接已复制到剪贴板', 'success');
            }).catch(() => {
                this.showNotification('复制失败，请手动复制', 'error');
            });
        }
    }

    exitRoom() {
        if (confirm('确定要退出房间吗？')) {
            this.currentRoom = null;
            this.currentPlayer = null;
            this.players = [];
            this.gameState = 'waiting';
            this.isHost = false;
            
            // 清除URL参数
            const url = new URL(window.location);
            url.searchParams.delete('room');
            url.searchParams.delete('name');
            window.history.pushState({}, '', url);
            
            this.showNotification('已退出房间', 'success');
            this.showPage('mainPage');
        }
    }

    showNotification(message, type = 'success') {
        // 移除现有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 播放提示音（如果支持）
        this.playNotificationSound(type);

        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    playNotificationSound(type) {
        // 简单的音效提示（使用Web Audio API）
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 根据类型设置不同的音调
            const frequencies = {
                'success': 800,
                'error': 400,
                'warning': 600
            };
            
            oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // 忽略音效错误
        }
    }

    // 工具方法
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startTimer(duration) {
        this.timeLeft = duration;
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timerDisplay').textContent = this.formatTime(this.timeLeft);
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.showNotification('时间到！', 'warning');
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    window.werewolfGame = new WerewolfGame();
});

// 处理浏览器前进后退
window.addEventListener('popstate', () => {
    if (window.werewolfGame) {
        window.werewolfGame.checkUrlParams();
    }
});
