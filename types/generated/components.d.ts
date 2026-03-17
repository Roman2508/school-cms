import type { Schema, Struct } from '@strapi/strapi';

export interface FooterFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_columns';
  info: {
    displayName: 'Footer column';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'footer.footer-column-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface FooterFooterColumnItem extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_column_items';
  info: {
    displayName: 'Footer column item';
    icon: 'bulletList';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterFooterContacts extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_contacts';
  info: {
    displayName: 'Footer contacts';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'homepage.home-info-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface HeaderSocial extends Struct.ComponentSchema {
  collectionName: 'components_header_socials';
  info: {
    displayName: 'social';
    icon: 'link';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HeaderSubmenu extends Struct.ComponentSchema {
  collectionName: 'components_header_submenus';
  info: {
    displayName: 'submenu3';
    icon: 'bulletList';
  };
  attributes: {
    link: Schema.Attribute.String;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HeaderSubmenu1 extends Struct.ComponentSchema {
  collectionName: 'components_header_submenu1s';
  info: {
    displayName: 'submenu1';
    icon: 'bulletList';
  };
  attributes: {
    link: Schema.Attribute.String;
    submenu: Schema.Attribute.Component<'header.submenu2', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HeaderSubmenu2 extends Struct.ComponentSchema {
  collectionName: 'components_header_submenu2s';
  info: {
    displayName: 'submenu2';
    icon: 'bulletList';
  };
  attributes: {
    link: Schema.Attribute.String;
    submenu: Schema.Attribute.Component<'header.submenu', true>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageAbout extends Struct.ComponentSchema {
  collectionName: 'components_homepage_abouts';
  info: {
    displayName: 'About';
    icon: 'bulletList';
  };
  attributes: {
    advantages: Schema.Attribute.Component<'homepage.about-advantages', true>;
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    image_text: Schema.Attribute.String;
    image_title: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageAboutAdvantages extends Struct.ComponentSchema {
  collectionName: 'components_homepage_about_advantages';
  info: {
    displayName: 'About advantages';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageContacts extends Struct.ComponentSchema {
  collectionName: 'components_homepage_contacts';
  info: {
    displayName: 'Contacts';
    icon: 'bulletList';
  };
  attributes: {
    contact_persons: Schema.Attribute.Relation<
      'oneToMany',
      'api::stuff-member.stuff-member'
    >;
    info_items: Schema.Attribute.Component<'homepage.home-info-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    info_title: Schema.Attribute.String & Schema.Attribute.Required;
    map_embed_url: Schema.Attribute.Text & Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageEventsFeed extends Struct.ComponentSchema {
  collectionName: 'components_homepage_events_feeds';
  info: {
    displayName: 'Events feed';
    icon: 'bulletList';
  };
  attributes: {
    all_link_label: Schema.Attribute.String & Schema.Attribute.Required;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<4>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageHero extends Struct.ComponentSchema {
  collectionName: 'components_homepage_heroes';
  info: {
    displayName: 'Hero';
    icon: 'bulletList';
  };
  attributes: {
    bottom_button_text: Schema.Attribute.String;
    buttons: Schema.Attribute.Component<'homepage.hero-buttons', true>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    stats: Schema.Attribute.Component<'homepage.stats', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageHeroButtons extends Struct.ComponentSchema {
  collectionName: 'components_homepage_hero_buttons';
  info: {
    displayName: 'Hero buttons';
    icon: 'bulletList';
  };
  attributes: {
    button_type: Schema.Attribute.Enumeration<['primary', 'outline']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageHomeInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_homepage_home_info_items';
  info: {
    displayName: 'Home info item';
    icon: 'bulletList';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface HomepageNewsFeed extends Struct.ComponentSchema {
  collectionName: 'components_homepage_news_feeds';
  info: {
    displayName: 'News feed';
    icon: 'bulletList';
  };
  attributes: {
    all_link_label: Schema.Attribute.String & Schema.Attribute.Required;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<3>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageStats extends Struct.ComponentSchema {
  collectionName: 'components_homepage_stats';
  info: {
    displayName: 'Stats nested';
    icon: 'bulletList';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageStatsBlock extends Struct.ComponentSchema {
  collectionName: 'components_homepage_stats_blocks';
  info: {
    displayName: 'Stats block';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'homepage.stats', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String;
  };
}

export interface SharedAccordion extends Struct.ComponentSchema {
  collectionName: 'components_shared_accordions';
  info: {
    displayName: 'Accordion';
    icon: 'bulletList';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    items: Schema.Attribute.Component<'shared.accordion-item', true>;
    multiply_open: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAccordionItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_accordion_items';
  info: {
    displayName: 'Accordion item';
    icon: 'bulletList';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    default_open: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_button_links';
  info: {
    displayName: 'Button link';
    icon: 'bulletList';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'left'>;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['full', 'auto']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['default', 'outline', 'link', 'secondary']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'> &
      Schema.Attribute.Required;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.footer-column': FooterFooterColumn;
      'footer.footer-column-item': FooterFooterColumnItem;
      'footer.footer-contacts': FooterFooterContacts;
      'header.social': HeaderSocial;
      'header.submenu': HeaderSubmenu;
      'header.submenu1': HeaderSubmenu1;
      'header.submenu2': HeaderSubmenu2;
      'homepage.about': HomepageAbout;
      'homepage.about-advantages': HomepageAboutAdvantages;
      'homepage.contacts': HomepageContacts;
      'homepage.events-feed': HomepageEventsFeed;
      'homepage.hero': HomepageHero;
      'homepage.hero-buttons': HomepageHeroButtons;
      'homepage.home-info-item': HomepageHomeInfoItem;
      'homepage.news-feed': HomepageNewsFeed;
      'homepage.stats': HomepageStats;
      'homepage.stats-block': HomepageStatsBlock;
      'shared.accordion': SharedAccordion;
      'shared.accordion-item': SharedAccordionItem;
      'shared.button-link': SharedButtonLink;
      'shared.media': SharedMedia;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
    }
  }
}
