declare namespace API {
  export type CurrentUser = {
    uname?: string;
    telephone?: string;
    name?: string;
    isDelete?: boolean;
    signature?: string;
    userGroups?: {
      id: number;
      name: string;
    }[];
    id?: number;
    user_type: any;
  };

  export type LoginStateType = {
    op?: 'ok' | 'error';
    message?: string;
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
}
