// English copy. Natural English, not a word-for-word translation of tr.ts.
// Every claim maps to a source in docs/ICERIK_KAYNAKLARI.md.
import type { Content } from './schema';

export const en = {
  meta: {
    title: 'TAYKUT — High School Rover Team · Ankara',
    description:
      'TAYKUT is a high school rover team from ASELSAN Vocational and Technical Anatolian High School in Ankara, Türkiye. We designed and built our rover from scratch and placed 4th overall at the MRC 2026 finals.',
    ogAlt: 'The yellow-wheeled TAYKUT rover on a gravel test course',
  },
  a11y: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    switchTo: 'Türkçe',
    externalLink: '(opens in a new tab)',
    scrollDown: 'Scroll down',
    menu: 'Menu',
  },
  kinds: {
    result: 'competition result',
    measured: 'measured',
    calculated: 'calculated',
    estimate: 'estimate',
    'design-target': 'design target',
    assumption: 'assumption',
    simulated: 'simulation',
  },
  units: { min: 'min' },
  statuses: {
    competed: 'Competed',
    target: 'Target',
    dream: 'Someday',
  },
  nav: {
    rover: 'Rover',
    missions: 'Missions',
    engineering: 'Engineering',
    station: 'Ground Station',
    team: 'Team',
    sponsor: 'Become a Sponsor',
  },
  hero: {
    kicker: 'Ankara · High school rover team',
    title: 'TAYKUT',
    tagline: ['Designed in Ankara.', 'Built for other worlds.'],
    lead: 'We are high school students. We designed and built our rover from scratch and placed fourth overall at the Micro Rover Challenge 2026 finals.',
    primary: { label: 'Become a Sponsor' },
    secondary: { label: 'See the Missions' },
    imageAlt:
      'The SummerTech rover on a light gray gravel course: yellow TPU wheels, inverted-V aluminum rocker arms, a drill arm reaching forward and a white sample box on top.',
    strip: 'MRC 2026 · 4th overall',
  },
  inspect: {
    index: '01',
    kicker: 'Rover',
    title: ['Every part', 'is there for a reason.'],
    lead: 'SummerTech Rover fits in 45×45 cm. Spring-free suspension, three separate brains and a single arm that handles three missions.',
    imageAlt:
      'Night mission: the yellow octopus gripper on the rover’s arm grabs black cylindrical batteries; a green LED power panel stands on the left.',
    parts: {
      wheel: { name: 'TPU wheel', spec: '95A TPU, zig-zag tread, honeycomb core, Ø10 cm; printed in-house' },
      rocker: { name: 'Rocker', spec: 'No springs, no dampers; each wheel follows the ground on its own' },
      differential: {
        name: 'Differential',
        spec: 'One side rises, the other drops; the body stays at the average',
      },
      arm: { name: '3-axis arm', spec: 'ASA print; base, reach and tool; swappable tool head' },
      gripper: { name: 'Octopus gripper', spec: 'Segmented jaws that hold irregular and slippery objects' },
      drill: { name: 'Auger drill', spec: 'Archimedes screw that carries the sample into a sealed tube' },
      camera: { name: 'Arm camera', spec: 'Reads ArUco markers and streams live to the operator' },
      pixhawk: { name: 'Pixhawk 2.4.8', spec: 'ArduRover; GPS + IMU + odometry fusion' },
      pi: { name: 'Raspberry Pi 4B', spec: 'OpenCV vision and mission logic' },
      mega: { name: 'Arduino Mega 2560', spec: 'Encoder motor PID, servos, load cell' },
      battery: { name: '3S Li-ion battery', spec: '5600 mAh; ~35 min at an 8.05 A average draw' },
      samples: { name: 'Sample box', spec: 'Three independent bays; no cross-contamination' },
    },
  },
  missions: {
    index: '02',
    kicker: 'Missions',
    title: ['Six places.', 'One rover family.'],
    lead: 'From the course we competed on to the fields we are aiming for: mission drives on terrain built from real elevation data.',
    mapAlt: 'World map with six mission sites: Ankara, MRC 2026, Drumheller, the Swiss Alps, Utah and Mars.',
    viewMission: 'Go to mission',
    coordinates: 'Coordinates',
    regions: {
      ankara: {
        name: 'Home Base',
        place: 'Ankara, Türkiye',
        summary: 'Where it all started. Out of the workshop, a short test drive and calibration.',
        steps: ['Leave the workshop', 'Short test drive', 'ArUco calibration', 'Ready'],
      },
      mrc2026: {
        name: 'Micro Rover Challenge 2026',
        place: 'Final course',
        summary:
          'Our real result: 1st in the application video round, 4th overall at the finals. We completed all three missions on the field.',
        steps: ['Fully autonomous ArUco mission', 'Drilling mission', 'Night and power mission'],
      },
      drumheller: {
        name: 'CIRC 2027',
        place: 'Drumheller, Alberta, Canada',
        summary:
          'Our main goal. We are already driving the new rover in a digital twin built from real lidar data of this region.',
        steps: [
          'Drive through the clay hills',
          'Science: sample collection',
          'Equipment servicing',
          'Autonomous navigation',
        ],
      },
      alps: {
        name: 'Alpine Terrain',
        place: 'Swiss Alps',
        summary: 'Rocky slopes, snow and gravel. The toughest test for the suspension.',
        steps: ['Climb a rocky slope', 'Cross snow and gravel', 'Servicing task'],
      },
      utah: {
        name: 'Mars Desert Research Station',
        place: 'Hanksville, Utah, USA',
        summary: 'The best-known Mars-like rover field on Earth. We want to drive there someday.',
        steps: ['Long autonomous traverse', 'Photograph a rock'],
      },
      mars: {
        name: 'Jezero Crater',
        place: 'Mars',
        summary:
          'The last stop of the dream. A short drive across a crater floor built from real elevation data.',
        steps: ['Drive the crater floor', 'Look for Earth in the sky'],
      },
    },
  },
  stats: {
    index: '03',
    kicker: 'By the numbers',
    title: ['Small rover,', 'clear results.'],
    items: {
      videoRank: 'MRC 2026 application video ranking',
      finalRank: 'MRC 2026 finals, overall',
      envelope: 'Size limit',
      runtime: 'Runtime (from the energy budget)',
      speed: 'Cruise speed (11.1 V, no load)',
      brains: 'Boards: Pixhawk, Raspberry Pi, Arduino Mega',
    },
  },
  engineering: {
    index: '04',
    kicker: 'Engineering',
    title: ['Not off-the-shelf.', 'Our own solutions.'],
    lead: 'We designed, built and tested every subsystem, from mechanics to software. We also wrote down our weak points; the next rover learns from them.',
    systems: {
      mechanical: {
        name: 'Mechanical',
        body: 'A four-wheel differential rocker suspension adapted from the rocker-bogie idea. No springs, no dampers.',
        points: [
          'Skid-steer: turns in place',
          '4× Namiki 22CL, 80:1 planetary gearing',
          'TPU wheels printed in-house',
        ],
      },
      electronics: {
        name: 'Electronics',
        body: 'A three-board architecture: if one stops, the system does not lock up. Motors, servos and sensitive electronics run on separate lines.',
        points: [
          '3S 5600 mAh Li-ion',
          'XT60 power distribution, separate UBECs',
          '8.05 A average energy budget',
        ],
      },
      software: {
        name: 'Software & Autonomy',
        body: 'Instead of writing navigation from scratch we chose the real-time Pixhawk; vision and mission logic are ours.',
        points: ['ArduRover + Mission Planner', 'ArUco detection with OpenCV', 'GPS + odometry fusion'],
      },
      arm: {
        name: 'Arm & Gripper',
        body: 'One arm, swappable tools. Less weight, fewer failure points, faster switching between missions.',
        points: ['3 axes, ASA print', 'Octopus gripper', 'Servos driven by a PCA9685'],
      },
      science: {
        name: 'Science',
        body: 'A load cell measures soil firmness, an auger takes a subsurface sample, and samples stay in separate bays.',
        points: ['5 kg load cell + HX711', 'Auger drill', 'Three isolated sample bays'],
      },
    },
    twin: {
      title: 'Digital twin',
      body: 'Before the new rover ever reaches the field, we drive it in ROS 2 and Gazebo on terrain built from real lidar elevation data of Drumheller.',
      proof:
        'In a simulation test on real terrain data, the left rocker sat at −18.01° and the right at +18.08°: the differential keeps both sides equal and opposite within 0.065°.',
    },
  },
  station: {
    index: '05',
    kicker: 'Ground Station',
    title: ['We wrote our own', 'mission control.'],
    lead: 'Instead of an off-the-shelf interface, a web ground station we wrote from scratch: it watches the rover, drives it and runs autonomous missions.',
    features: [
      'Live camera and ArUco detection',
      '2D map and 3D scene; top-down and follow views',
      'Emergency stop on every screen, with a lock',
      'Waypoint missions and autonomy tasks',
      'PID tuning and telemetry charts',
    ],
    honesty: 'The demo here runs as a simulation in your browser; it is not connected to the real rover.',
    openDemo: 'Open the live demo',
    videoAlt: 'Screen recording of the ground station: camera panel, map and telemetry charts.',
  },
  journey: {
    index: '06',
    kicker: 'Journey',
    title: ['From zero', 'to the finals.'],
    now: 'Now',
    items: [
      {
        date: 'Nov 2025',
        title: 'The team is born',
        body: 'A handful of high school students and one rover idea.',
      },
      {
        date: '2026',
        title: '1st in the video round',
        body: 'First place in the application video review of the Micro Rover Challenge.',
      },
      {
        date: 'Jul–Aug 2026',
        title: 'MRC 2026 finals: 4th overall',
        body: 'We completed all three missions on the field.',
      },
      {
        date: '2026–27',
        title: 'New crew, new rover',
        body: 'Rebuilt with new members at ASELSAN Vocational High School. The new rover lives in a digital twin.',
      },
      {
        date: 'Aug 2027',
        title: 'Goal: CIRC',
        body: 'Our expression of interest for the Canadian International Rover Challenge is in.',
      },
    ],
  },
  team: {
    index: '07',
    kicker: 'Team',
    title: ['Seven people.', 'One rover.'],
    lead: 'A high school crew learning and building mechanics, electronics and software together.',
    captain: 'Team Captain',
    advisor: 'Faculty Advisor',
    member: 'Team Member',
  },
  sponsor: {
    index: '08',
    kicker: 'Become a Sponsor',
    title: ['Put your logo', 'on the field.'],
    lead: 'Parts, manufacturing, travel or mentoring: every bit of support moves us one step closer to the next competition.',
    why: [
      {
        title: 'Visibility',
        body: 'Your logo on the rover, on our team wear, on this site and in our competition presentations.',
      },
      { title: 'International stage', body: 'Our goal is CIRC in Canada; your support travels with us.' },
      {
        title: 'Future engineers',
        body: 'Your support goes to high school students learning on a real engineering project.',
      },
    ],
    tiers: {
      drumheller: {
        name: 'Drumheller',
        body: 'Title sponsor.',
        perks: [
          'Largest logo space on the rover',
          'Featured placement in every presentation and on the site',
          'Thanks in our competition reports',
        ],
      },
      alpine: {
        name: 'Alpine',
        body: 'Major supporter.',
        perks: ['Logo on the rover', 'Logo on the site and in presentations', 'Thanks on social media'],
      },
      regolith: {
        name: 'Regolith',
        body: 'Supporter.',
        perks: ['Logo on the site', 'Thanks on social media'],
      },
      friend: {
        name: 'Friend',
        body: 'Parts, manufacturing, travel or mentoring.',
        perks: ['Thanks on the site', 'Visibility matched to the kind of support'],
      },
    },
    emptyWall: 'Be our first sponsor.',
    contactTitle: 'Let’s talk',
    emailCta: 'Send an email',
    instagramCta: 'Message us on Instagram',
  },
  footer: {
    school: 'ASELSAN Vocational and Technical Anatolian High School · Ankara',
    advisor: 'Advisor: Mustafa Seyhan',
    captain: 'Captain: Kerem Sümer',
    attributions: 'Data and attributions',
    license: 'Code is MIT licensed. Photos, logo and text © TAYKUT.',
    shortcuts: 'Keyboard shortcuts',
    rights: 'All rights reserved.',
    press: 'Press kit',
  },
  pages: {
    sponsor: {
      title: 'Sponsorship',
      lead: 'Supporting TAYKUT means supporting high school students who put a real rover on the field. Every kind of support helps.',
      placementTitle: 'Where does your logo appear?',
      placements: [
        'On the rover body and arm',
        'On our team wear',
        'On this site and in our press kit',
        'In competition design reports and presentations',
        'In our social media posts',
      ],
      faqTitle: 'Common questions',
      faq: [
        {
          q: 'Do you only accept money?',
          a: 'No. Motors, sensors, filament, aluminum, CNC or laser cutting, travel and mentoring are just as valuable.',
        },
        {
          q: 'Are the tiers fixed?',
          a: 'The tiers are a starting point. We agree on visibility together based on the kind of support.',
        },
        {
          q: 'Where does the support go?',
          a: 'Rover parts, manufacturing, and competition fees and travel. After every competition we send our supporters a short report.',
        },
      ],
    },
    rover: {
      title: 'Our rovers',
      lead: 'The rover we competed with and the new rover we are designing now. Every value says what kind it is: measured, calculated, estimated or a design target.',
      summertechTitle: 'SummerTech Rover · MRC 2026',
      summertechNote:
        'The rover that placed 4th overall at the Micro Rover Challenge 2026 finals. Values come from the team’s technical documentation.',
      rover2027Title: 'TAYKUT 2027 rover · in design',
      rover2027Note:
        'This rover is still in design and simulation. Values are pulled automatically from the digital twin’s parameter file and will change as the design matures.',
      specs: {
        envelope: 'Size',
        wheels: 'Wheels',
        wheelDiameter: 'Wheel diameter',
        motors: 'Motors',
        speed: 'Cruise speed',
        runtime: 'Runtime',
        range: 'Range',
        battery: 'Battery',
        averageCurrent: 'Average current',
        suspension: 'Suspension',
        steering: 'Steering',
        mass: 'Total mass',
        wheelbase: 'Wheelbase',
        trackWidth: 'Track width',
        bodySize: 'Body size',
        groundClearance: 'Ground clearance',
        motor: 'Motor',
        maxSpeed: 'Top speed',
        voltage: 'Voltage',
      },
      enums: {
        rocker_bogie_differential: 'Rocker-bogie + differential',
        skid_steer: 'Skid-steer (turns in place)',
        DJI_M3508_P19_24V: 'DJI M3508 P19 (24 V), direct drive',
      },
    },
    press: {
      title: 'Press kit',
      lead: 'Everything you need to write about TAYKUT. Feel free to use the text as is.',
      shortTitle: 'Short bio',
      short:
        'TAYKUT is a rover team from ASELSAN Vocational and Technical Anatolian High School in Ankara, Türkiye. The team of high school students designed and built its rover from scratch and placed fourth overall at the Micro Rover Challenge 2026 finals. Its next goal is CIRC 2027 in Canada.',
      longTitle: 'Long bio',
      long: 'TAYKUT is a high school rover team founded in November 2025 and now based at ASELSAN Vocational and Technical Anatolian High School in Ankara, Türkiye. Its first rover, SummerTech, is an autonomous planetary rover that fits in 45×45 cm, rides on a spring-free differential rocker suspension and runs on a three-board architecture of Pixhawk, Raspberry Pi and Arduino Mega. The rover placed first in the application video round of the Micro Rover Challenge 2026 and fourth overall at the finals. The team is now developing a six-wheel rover in a digital twin built from real lidar data of Drumheller and testing it with a ground station it wrote itself. The goal is the CIRC competition in Canada in August 2027.',
      logoTitle: 'Logo',
      logoNote:
        'Use the logo without changing its proportions or colors. On dark backgrounds, place it on a white plate.',
      downloadLogo: 'Download logo (PNG)',
      photosTitle: 'Photos',
      photosNote: 'Photos © TAYKUT. Free to use in news coverage with credit.',
    },
  },
  notFound: {
    title: 'The rover drove off course.',
    body: 'The page you are looking for is not on this terrain.',
    home: 'Back to base',
  },
  fallback: {
    noWebgl: '3D could not start on this device; showing photos instead.',
  },
} satisfies Content;
