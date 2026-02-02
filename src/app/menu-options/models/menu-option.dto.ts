export class MenuOptionDto {
  id: number = 0;
  code: string = "";
  name: string = "";
  description?: string = "";
  menuUri: string | null = "";
  menuIcon: string | null = "";
  sortOrder: number = 0;
  actionCode: string | null = "";
  children: MenuOptionDto[] = [];
}
