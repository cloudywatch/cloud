import { Controller, Get, Post, Query, Param, Put, Req, Res, Body, Delete } from '@nestjs/common';
import { SectorService } from './sector.service';
import { Sector } from './models/sector.entity';
import { SectorDto } from './models/sector.dto';
import { AuthService } from 'src/auth/auth.service';
import { AbstractController } from 'src/common/abstract.controller';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('sector')
export class SectorController extends AbstractController {
    constructor(private sectorService: SectorService, private authService: AuthService) { super(sectorService); }
}
