export interface UserNameInterface {
  user_name: string;
}

export interface TitleInterface {
  title: string;
}

export interface BlogInterface extends UserNameInterface, TitleInterface {
  slug: string;
}

export interface SingleBlogDetailInterface
  extends UserNameInterface,
    TitleInterface {
  id: number;
  content: string;
  date_updated: string;
}
