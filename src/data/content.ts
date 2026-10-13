import {
  BatteryMedium,
  Bell,
  Bluetooth,
  Clipboard,
  FolderOpen,
  Globe,
  Keyboard,
  MessageSquare,
  Monitor,
  MousePointer2,
  Music,
  Pause,
  Phone,
  Power,
  Search,
  Terminal,
  Wifi,
} from 'lucide-solid';

export type Feature = {
  icon: typeof Bell;
  title: string;
  blurb: string;
  points: string[];
};

export const FEATURES: Feature[] = [
  {
    icon: Bell,
    title: 'Notifications',
    blurb: 'Phone notifications on your PC, with their buttons and a reply box.',
    points: [
      'Phone → PC notifications with actions and inline replies',
      'Dismiss one on the PC and it clears on the phone too',
      'PC → phone notifications, from the apps you choose',
    ],
  },
  {
    icon: MessageSquare,
    title: 'Texts, calls & contacts',
    blurb: 'Read and send texts, pictures included. Answer calls from your desk.',
    points: [
      'Read and send SMS from the PC, with pictures',
      'See who is calling; answer, reject, hang up or go on speaker',
      'Your music pauses while the phone rings',
      'Call or text any contact from the PC',
    ],
  },
  {
    icon: FolderOpen,
    title: 'Files',
    blurb: 'Send files both ways and browse another device’s storage, from anywhere.',
    points: [
      'Pick, drag and drop, or use your phone’s share menu',
      'Browse the phone from the PC, a PC from the phone, or PC to PC',
      '“Send to Device” in Nautilus, Dolphin and Nemo on Linux',
      'Received files land in Downloads/Pairly',
    ],
  },
  {
    icon: Clipboard,
    title: 'Clipboard & links',
    blurb: 'Copy on one device, paste on the other.',
    points: [
      'Automatic clipboard sync, or only when you ask',
      'Links you send open in the browser on the other side',
      'Text you send lands straight in the clipboard',
    ],
  },
  {
    icon: Monitor,
    title: 'Screens',
    blurb: 'See and control your phone on the PC, or your PC on the phone.',
    points: [
      'Phone screen on the PC: click, type and scroll',
      'PC screen on the phone, with zoom and rotate',
      'PC to PC: control your other computer, Linux ↔ Windows',
    ],
  },
  {
    icon: MousePointer2,
    title: 'Remote control',
    blurb: 'Your phone becomes a touchpad, a keyboard and a presenter.',
    points: [
      'Touchpad and keyboard for the PC',
      'Presenter mode with a red laser pointer drawn on screen',
      'Type on the phone with the PC’s keyboard, arrow keys included',
    ],
  },
  {
    icon: Music,
    title: 'Media',
    blurb: 'Control what’s playing, wherever it’s playing.',
    points: [
      'Control the PC’s music and videos from the phone, lock screen included',
      'Works with Spotify, browsers and other players',
      'Control the phone’s music from the PC',
    ],
  },
  {
    icon: Search,
    title: 'Find my phone',
    blurb: 'Rings it at full volume, even on silent. The phone can ring the PC too.',
    points: ['Full-volume ring that overrides silent mode', 'Ring the PC from the phone as well'],
  },
];

export const EXTRAS = [
  { icon: BatteryMedium, title: 'Battery', text: 'See each device’s battery level.' },
  { icon: Power, title: 'Power', text: 'Lock, restart or power off the PC from the phone, and the other way round.' },
  { icon: Terminal, title: 'Commands', text: 'Run your own commands on the PC from the phone.' },
  { icon: Pause, title: 'Pause a device', text: 'Cut a device off completely until you resume it, without unpairing.' },
  { icon: Keyboard, title: 'One switch', text: 'Turn Pairly off everywhere at once. Light and dark themes too.' },
  { icon: Phone, title: 'Rename devices', text: 'Call your devices whatever you like, whenever you like.' },
];

export const LINKS = [
  {
    icon: Wifi,
    name: 'Wi-Fi',
    when: 'At home or the office. Devices find each other by themselves.',
    speed: 3,
    tag: 'Fastest',
  },
  {
    icon: Bluetooth,
    name: 'Bluetooth',
    when: 'No shared network, devices close by. Slower, but fine for messages.',
    speed: 1,
    tag: 'No network needed',
  },
  {
    icon: Globe,
    name: 'Internet relay',
    when: 'Anywhere else: mobile data, another Wi-Fi. Your own free relay on Cloudflare.',
    speed: 2,
    tag: 'From anywhere',
  },
];

export const MATRIX: { feature: string; linux: string; windows: string; android: string }[] = [
  { feature: 'Notifications both ways', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'Texts, calls, contacts', linux: 'From the phone', windows: 'From the phone', android: 'Shares them' },
  { feature: 'Send files, links, text', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'Browse other devices’ files', linux: '✓', windows: '✓', android: 'A PC’s shared folder' },
  { feature: 'Share its own files', linux: 'A folder you pick', windows: 'A folder you pick', android: 'Its storage' },
  { feature: 'Clipboard both ways', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'See and control the other screen', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'Touchpad, keyboard, presenter', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'Media control', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'Find my phone, battery, power', linux: '✓', windows: '✓', android: '✓' },
  { feature: 'Updates itself', linux: '✓', windows: '✓', android: '✓' },
];
