import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Match } from '../../domain/model';
import { Observable } from 'rxjs/Observable';
import { MatchesService } from '../../services/matches.service';

@Injectable()
export class MatchResolver implements Resolve<Match> {

  constructor(
    private matchesService: MatchesService
  ) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Match | Observable<Match> | Promise<Match> {
    return this.matchesService.get(route.params.id);
  }

}
