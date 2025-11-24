import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  from: 'user' | 'bot';
  text: string;
  videoUrl?: string;
  videoBlob?: Blob;
  isPendingUpload?: boolean;
}

@Component({
  selector: 'app-support-chatbot',
  templateUrl: './support-chatbot.component.html',
  styleUrls: ['./support-chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SupportChatbotComponent implements AfterViewChecked, OnInit, OnChanges {
  @Input() apiUrl: string = 'http://localhost:3000';
  @Input() chatApiEndpoint: string = '/api/chat';
  @Input() ticketApiEndpoint: string = '/api/tickets';
  @Input() botName: string = 'Qurix Support Assistant';
  @Input() botAvatar: string = '/qurix.ico';
  @Input() initialMessage: string = 'Hello! How can I help you today?';
  @Input() userData: { username?: string; empid?: string } | string | null = null;
  @Input() username: string = '';
  @Input() empid: string = '';
  @Output() onClose = new EventEmitter<void>();
  @Output() onMinimize = new EventEmitter<void>();

  messages: Message[] = [];
  userInput: string = '';
  chatHistory: { role: string, content: string }[] = [];
  isMinimized: boolean = false;
  isVisible: boolean = false;
  private _username: string = '';
  private _empid: string = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  mediaRecorder!: MediaRecorder;
  recordedChunks: Blob[] = [];
  pendingVideoBlob: Blob | null = null;
  isRecording: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    // Initialize messages with the initial message (inputs are available in ngOnInit)
    this.messages = [{ from: 'bot', text: this.initialMessage }];

    // Load user data from sessionStorage or use provided input
    this.loadUserData();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle userData changes (can be object or JSON string for Angular elements)
    if (changes['userData'] && this.userData) {
      this.parseUserData();
      this.saveUserDataToSession();
    }

    // Handle individual username/empid inputs (for easier Angular element usage)
    if (changes['username']) {
      this._username = this.username || '';
      this.saveUserDataToSession();
    }
    if (changes['empid']) {
      this._empid = this.empid || '';
      this.saveUserDataToSession();
    }

    // Load user data if any input changed
    if (changes['userData'] || changes['username'] || changes['empid']) {
      this.loadUserData();
    }
  }

  parseUserData() {
    if (!this.userData) return;

    try {
      let userDataObj: { username?: string; empid?: string };

      // If userData is a string (JSON), parse it (for Angular elements)
      if (typeof this.userData === 'string') {
        userDataObj = JSON.parse(this.userData);
      } else {
        // If it's already an object
        userDataObj = this.userData;
      }

      // Update internal values
      if (userDataObj.username) {
        this._username = userDataObj.username;
      }
      if (userDataObj.empid) {
        this._empid = userDataObj.empid;
      }
    } catch (e) {
      console.error('Error parsing userData:', e);
    }
  }

  saveUserDataToSession() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const userData = {
          username: this._username || this.username,
          empid: this._empid || this.empid
        };
        const userDataJson = JSON.stringify(userData);
        sessionStorage.setItem('chatbot_user_data', userDataJson);
      } catch (e) {
        console.error('Error saving user data to sessionStorage:', e);
      }
    }
  }

  loadUserData() {
    // Priority: 1. Direct @Input properties, 2. Parsed userData, 3. sessionStorage
    this._username = this.username || this._username || '';
    this._empid = this.empid || this._empid || '';

    // If we have userData, parse it
    if (this.userData) {
      this.parseUserData();
    }

    // If still no data, try sessionStorage (only in browser)
    if (!this._username && !this._empid && isPlatformBrowser(this.platformId)) {
      try {
        const storedData = sessionStorage.getItem('chatbot_user_data');
        if (storedData) {
          const userData = JSON.parse(storedData);
          this._username = userData.username || '';
          this._empid = userData.empid || '';
        }
      } catch (e) {
        console.error('Error parsing user data from sessionStorage:', e);
      }
    }
  }

  // Getters for username and empid
  get currentUsername(): string {
    return this._username || this.username || '';
  }

  get currentEmpid(): string {
    return this._empid || this.empid || '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch { }
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ from: 'user', text: this.userInput });

    // Add user message to chat history for AI context
    this.chatHistory.push({ role: 'user', content: this.userInput });

    const userMsg = this.userInput;
    this.userInput = '';

    // Trigger change detection to show user message immediately
    this.cdr.detectChanges();
    setTimeout(() => this.scrollToBottom(), 0);

    // Call backend AI chat API
    const chatUrl = `${this.apiUrl}${this.chatApiEndpoint}`;
    this.http.post<{ reply: string }>(chatUrl, {
      message: userMsg,
      chatHistory: this.chatHistory,
      username: this.currentUsername,
      empid: this.currentEmpid
    }).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.reply });
        // Add bot reply to chat history
        this.chatHistory.push({ role: 'assistant', content: res.reply });
        // Trigger change detection to update the view immediately
        this.cdr.detectChanges();
        // Scroll to bottom after message is added
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: () => {
        this.messages.push({ from: 'bot', text: 'Sorry, something went wrong!' });
        // Trigger change detection for error message too
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  onScreenshotSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file, 'screenshot');
      this.messages.push({ from: 'user', text: `[Screenshot attached: ${file.name}]` });
      this.messages.push({ from: 'bot', text: 'Screenshot uploaded.' });
    }
  }

  async startVideoRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert('Screen recording not supported in your browser.');
      return;
    }

    try {
      // Request screen sharing with audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser', // or 'window', 'monitor'
          cursor: 'always' // Show cursor in recording
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      } as MediaStreamConstraints);

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.onstop = async () => {
        // Stop all tracks first
        stream.getTracks().forEach(track => track.stop());

        // Focus the window/tab immediately to bring user back to chatbot
        window.focus();

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);

        // Store the blob for later upload
        this.pendingVideoBlob = blob;

        // Add video preview to chat
        const newMessage = {
          from: 'user' as const,
          text: 'Screen recording ready',
          videoUrl: videoURL,
          videoBlob: blob,
          isPendingUpload: true
        };

        this.messages.push(newMessage);

        // Force change detection multiple times to ensure UI updates
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
          this.scrollToBottom();
          this.cdr.detectChanges();

          // Additional check after a short delay
          setTimeout(() => {
            this.scrollToBottom();
            this.cdr.detectChanges();
          }, 200);
        });
      };

      // Handle user stopping screen share from browser UI
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        if (this.isRecording) {
          this.stopVideoRecording();
        }
      });

      this.mediaRecorder.start();
      this.isRecording = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error starting screen recording:', error);
      alert('Failed to start screen recording. Please check your browser permissions.');
    }
  }

  stopVideoRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      // Focus the window immediately when user clicks stop
      window.focus();
      this.cdr.detectChanges();
    }
  }

  sendVideo(messageIndex: number) {
    const message = this.messages[messageIndex];
    if (!message.videoBlob) return;

    const videoFile = new File([message.videoBlob], 'screen-recording.webm', { type: 'video/webm' });

    // Update message to show uploading state
    message.text = 'Uploading screen recording...';
    message.isPendingUpload = false;
    this.cdr.detectChanges();

    // Upload video
    this.uploadFile(videoFile, 'video', messageIndex);
  }

  cancelVideo(messageIndex: number) {
    const message = this.messages[messageIndex];
    if (message.videoUrl) {
      URL.revokeObjectURL(message.videoUrl);
    }
    this.messages.splice(messageIndex, 1);
    this.pendingVideoBlob = null;
    this.cdr.detectChanges();
  }

  uploadFile(file: File, type: string, messageIndex?: number) {
    const formData = new FormData();
    formData.append(type, file);
    formData.append('description', 'User support ticket attachment');

    // Add username and empid to form data
    if (this.currentUsername) {
      formData.append('username', this.currentUsername);
    }
    if (this.currentEmpid) {
      formData.append('empid', this.currentEmpid);
    }

    const ticketUrl = `${this.apiUrl}${this.ticketApiEndpoint}`;
    return this.http.post(ticketUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        console.log(`${type} upload progress: ${percentDone}%`);
        if (messageIndex !== undefined) {
          const message = this.messages[messageIndex];
          if (message) {
            message.text = `Uploading screen recording... ${percentDone}%`;
            this.cdr.detectChanges();
          }
        }
      } else if (event.type === HttpEventType.Response) {
        console.log(`${type} uploaded successfully`);
        if (messageIndex !== undefined) {
          const message = this.messages[messageIndex];
          if (message) {
            message.text = '[Screen recording uploaded]';
            message.isPendingUpload = false;
            // Clean up blob reference after upload
            if (message.videoUrl) {
              URL.revokeObjectURL(message.videoUrl);
              message.videoUrl = undefined;
            }
            message.videoBlob = undefined;
            this.cdr.detectChanges();

            // Get AI response about the uploaded video
            this.getAIResponseForVideo();
          }
        }
      }
    }, error => {
      console.error(`Error uploading ${type}:`, error);
      if (messageIndex !== undefined) {
        const message = this.messages[messageIndex];
        if (message) {
          message.text = 'Failed to upload screen recording. Please try again.';
          message.isPendingUpload = true;
          this.cdr.detectChanges();
        }
      }
    });
  }

  getAIResponseForVideo() {
    this.chatHistory.push({ role: 'user', content: 'I have uploaded a screen recording.' });
    const chatUrl = `${this.apiUrl}${this.chatApiEndpoint}`;
    this.http.post<{ reply: string }>(chatUrl, {
      message: 'I have uploaded a screen recording.',
      chatHistory: this.chatHistory,
      username: this.currentUsername,
      empid: this.currentEmpid
    }).subscribe({
      next: (res) => {
        this.messages.push({ from: 'bot', text: res.reply });
        this.chatHistory.push({ role: 'assistant', content: res.reply });
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: () => {
        this.messages.push({ from: 'bot', text: 'Screen recording received. Thank you!' });
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  openChat() {
    this.isVisible = true;
    // Load user data when opening chat
    this.loadUserData();
    if (this.messages.length === 0) {
      this.messages = [{ from: 'bot', text: this.initialMessage }];
    }
  }

  closeChat() {
    this.isVisible = false;
    this.onClose.emit();
  }

  minimizeChat() {
    this.isMinimized = !this.isMinimized;
    this.onMinimize.emit();
  }
}
