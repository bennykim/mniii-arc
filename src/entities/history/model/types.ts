import { BaseEntity } from "@/entities/base";

export interface History extends BaseEntity {
  name: string;
  description: string;
}
