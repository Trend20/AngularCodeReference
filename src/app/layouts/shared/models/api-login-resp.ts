export interface ApiLoginResp {
    access_token: string;
    token_type: string;
    expires_in: number;
    user_name: string;
    name: string;
    avatar_url:  string;
    user_id: string;
    project_screens: string;
    project_screens_inactive: string;
    configs: string;
    app_menu: string;
    appLogo_url: string;
    appLogo_background: string;
    user_mobile?: any;
    user_type?: any;
}
