type BaseTheme = 'default' | 'strategic' | 'innovator' | 'executive';

export const SITE_CONFIG: {
  baseTheme: BaseTheme;
  umami: { scriptUrl: string; websiteId: string };
} = {
  baseTheme: 'default',
  umami: {
    scriptUrl: 'https://analytics.rebma.cz/script.js',
    websiteId: 'b2ccf8e5-3071-4013-8f80-202fcba0fee5',
  },
};
