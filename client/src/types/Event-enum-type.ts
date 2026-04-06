export const EventEnum = {
  open: 1001,
  footer_vue_link: 1101,

  user_info_image_focus: 2001,
  user_info_contact_focus: 2101,
  user_info_contact_click: 2102,
  user_info_location_focus: 2201,

  resume_technology_focus: 3001, // пропущено
  resume_projects_block_focus: 3101,
  resume_projects_block_more_click: 3102,

  resume_education_more_link: 3201,

  training_certificates_block_focus: 4001,
  training_certificates_image_click: 4002,
  training_certificates_id_click: 4003,
  training_certificates_repo_click: 4004,
  training_certificates_project_link: 4005,
  training_certificates_course_click: 4006,

  training_projects_git_click: 4101,
  training_projects_block_focus: 4102,
  training_projects_repo_click: 4103,
  training_projects_demo_click: 4104,

  training_education_block_focus: 5001,
} as const;

export type EventEnumType = (typeof EventEnum)[keyof typeof EventEnum];

export function getEventIcon(eventId: number) {
  const icons: Record<number, string> = {
    1001: '🔓',
    1101: '🔗',
    2001: '🖼️',
    2101: '📞',
    2102: '📱',
    2201: '📍',
    3001: '⚙️',
    3101: '📁',
    3102: '📄',
    3201: '🎓',
    4001: '📜',
    4002: '🖼️',
    4003: '🆔',
    4004: '📦',
    4005: '🔗',
    4006: '📚',
    4101: '💻',
    4102: '📂',
    4103: '📦',
    4104: '🎮',
    5001: '🎓',
  };
  return icons[eventId] || '📋';
}
