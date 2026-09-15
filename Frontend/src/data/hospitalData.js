export const departments = [
  {
    id: 'general-medicine',
    name: 'General Medicine',
    description: 'Primary healthcare and general medical services',
    icon: '🩺',
    doctors: [
      {
        id: 'gen-sr-1',
        name: 'Dr. Priya Sharma',
        experience: 15,
        qualification: 'MD, General Medicine',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'gen-sr-2',
        name: 'Dr. Rajesh Kumar',
        experience: 12,
        qualification: 'MD, General Medicine',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'gen-sr-3',
        name: 'Dr. Kavya Menon',
        experience: 10,
        qualification: 'MD, General Medicine',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'gen-jr-1',
        name: 'Dr. Arjun Patel',
        experience: 3,
        qualification: 'MD, Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system specialists',
    icon: '❤️',
    doctors: [
      {
        id: 'card-sr-1',
        name: 'Dr. Vikram Reddy',
        experience: 18,
        qualification: 'MD, DM Cardiology',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'card-sr-2',
        name: 'Dr. Anita Gupta',
        experience: 14,
        qualification: 'MD, DM Cardiology',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'card-sr-3',
        name: 'Dr. Suresh Nair',
        experience: 16,
        qualification: 'MD, DM Cardiology',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'card-jr-1',
        name: 'Dr. Sneha Jain',
        experience: 4,
        qualification: 'MD, Cardiology Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain and nervous system specialists',
    icon: '🧠',
    doctors: [
      {
        id: 'neuro-sr-1',
        name: 'Dr. Ramesh Iyer',
        experience: 20,
        qualification: 'MD, DM Neurology',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'neuro-sr-2',
        name: 'Dr. Meera Krishnan',
        experience: 15,
        qualification: 'MD, DM Neurology',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'neuro-sr-3',
        name: 'Dr. Anil Agarwal',
        experience: 17,
        qualification: 'MD, DM Neurology',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'neuro-jr-1',
        name: 'Dr. Pooja Verma',
        experience: 3,
        qualification: 'MD, Neurology Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    description: 'Lung and respiratory system specialists',
    icon: '🌬️',
    doctors: [
      {
        id: 'pulm-sr-1',
        name: 'Dr. Deepak Singh',
        experience: 16,
        qualification: 'MD, DM Pulmonology',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'pulm-sr-2',
        name: 'Dr. Sunita Rao',
        experience: 13,
        qualification: 'MD, DM Pulmonology',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'pulm-sr-3',
        name: 'Dr. Manoj Chopra',
        experience: 18,
        qualification: 'MD, DM Pulmonology',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'pulm-jr-1',
        name: 'Dr. Ritika Bansal',
        experience: 3,
        qualification: 'MD, Pulmonology Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    description: 'Digestive system specialists',
    icon: '🧫',
    doctors: [
      {
        id: 'gastro-sr-1',
        name: 'Dr. Sanjay Mehta',
        experience: 16,
        qualification: 'MD, DM Gastroenterology',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'gastro-sr-2',
        name: 'Dr. Ritu Malhotra',
        experience: 13,
        qualification: 'MD, DM Gastroenterology',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'gastro-sr-3',
        name: 'Dr. Ashok Pandey',
        experience: 18,
        qualification: 'MD, DM Gastroenterology',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'gastro-jr-1',
        name: 'Dr. Rohit Saxena',
        experience: 3,
        qualification: 'MD, Gastroenterology Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin conditions specialists',
    icon: '🧴',
    doctors: [
      {
        id: 'derm-sr-1',
        name: 'Dr. Neha Kapoor',
        experience: 15,
        qualification: 'MD, DDV',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'derm-sr-2',
        name: 'Dr. Vivek Tiwari',
        experience: 12,
        qualification: 'MD, DDV',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'derm-sr-3',
        name: 'Dr. Smita Desai',
        experience: 14,
        qualification: 'MD, DDV',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'derm-jr-1',
        name: 'Dr. Karan Bhatia',
        experience: 3,
        qualification: 'MD, Dermatology Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'infectious-diseases',
    name: 'Infectious Diseases',
    description: 'Infectious disease specialists',
    icon: '🦠',
    doctors: [
      {
        id: 'inf-sr-1',
        name: 'Dr. Abhishek Joshi',
        experience: 17,
        qualification: 'MD, Infectious Diseases',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'inf-sr-2',
        name: 'Dr. Shweta Sinha',
        experience: 13,
        qualification: 'MD, Infectious Diseases',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'inf-sr-3',
        name: 'Dr. Manish Goyal',
        experience: 15,
        qualification: 'MD, Infectious Diseases',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'inf-jr-1',
        name: 'Dr. Priyanka Mishra',
        experience: 3,
        qualification: 'MD, Infectious Diseases Resident',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Bone, joint, and musculoskeletal system specialists',
    icon: '🦴',
    doctors: [
      {
        id: 'ortho-sr-1',
        name: 'Dr. Raghavan Pillai',
        experience: 19,
        qualification: 'MS Orthopedics, Fellowship in Joint Replacement',
        level: 'senior',
        availability: {
          hours: '6:00 AM - 2:00 PM',
          slots: ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
        }
      },
      {
        id: 'ortho-sr-2',
        name: 'Dr. Lakshmi Venkat',
        experience: 16,
        qualification: 'MS Orthopedics, Sports Medicine Specialist',
        level: 'senior',
        availability: {
          hours: '2:00 PM - 10:00 PM',
          slots: ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
        }
      },
      {
        id: 'ortho-sr-3',
        name: 'Dr. Harish Bhargava',
        experience: 21,
        qualification: 'MS Orthopedics, MCh Spine Surgery',
        level: 'senior',
        availability: {
          hours: '10:00 PM - 6:00 AM',
          slots: ['10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM']
        }
      },
      {
        id: 'ortho-jr-1',
        name: 'Dr. Tanvi Shah',
        experience: 4,
        qualification: 'MS Orthopedics, Pediatric Orthopedics Fellow',
        level: 'junior',
        availability: {
          hours: '10:00 AM - 5:00 PM',
          slots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']
        }
      }
    ]
  }
];
