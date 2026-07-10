import { PartialType } from '@nestjs/swagger';
import { CatalogReferenceDto } from './catalog-reference.dto';

export class UpdateCatalogReferenceDto extends PartialType(CatalogReferenceDto) {}
