export const EventEnum = {
  none: 0,
  open_resume: 1000,
  open_training: 1001,
  open_analytics: 1002,

  footer_vue_link: 1100,

  user_info_image_focus: 2000,
  user_info_phone_focus: 2001,
  user_info_phone_click: 2002,
  user_info_vk_focus: 2003,
  user_info_vk_click: 2004,
  user_info_mail_focus: 2005,
  user_info_mail_click: 2006,
  user_info_telegram_focus: 2007,
  user_info_telegram_click: 2008,
  user_info_max_focus: 2009,
  user_info_max_click: 2010,
  user_info_business_trip_focus: 2011,
  user_info_relocate_focus: 2012,

  resume_technology_focus: 3001,
  resume_projects_block_focus: 3002,
  resume_projects_block_more_click: 3003,
  resume_projects_block_less_click: 3004,

  resume_education_more_link: 3100,

  training_certificates_block_focus: 4000,
  training_certificates_image_click: 4001,
  training_certificates_id_click: 4002,
  training_certificates_repo_click: 4003,
  training_certificates_project_link: 4004,

  training_projects_git_click: 4005,
  training_projects_block_focus: 4006,
  training_projects_repo_click: 4007,
  training_projects_demo_click: 4008,

  training_education_block_focus: 5000,
} as const;

export type EventEnumType = (typeof EventEnum)[keyof typeof EventEnum];
