import {Component} from '@angular/core';
import {Playlist} from "./models/playlist.model";
import {DataService} from "./services/data.service";
import {SortModel} from "./models/sort.model";
import {Observable} from "rxjs";
import {map, mergeMap, shareReplay, toArray} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  playlist$: Observable<Playlist>;
  artists$: Observable<string[]>;

  searchTerm: string;
  activeFilter: string;
  activeSort: SortModel;

  sort: SortModel[] = [
    {
      name: 'Alphabetically',
      order: 'asc',
      type: 'title',
    },
    {
      name: 'Alphabetically',
      order: 'desc',
      type: 'title',
    },
    {
      name: 'Duration',
      order: 'asc',
      type: 'duration',
    },
    {
      name: 'Duration',
      order: 'desc',
      type: 'duration',
    },
    {
      name: 'Rank',
      order: 'asc',
      type: 'rank',
    },
    {
      name: 'Rank',
      order: 'desc',
      type: 'rank',
    },
  ];

  constructor(
    private _dataService: DataService
  ) {
    this.playlist$ = _dataService.getPlaylist();
    this.artists$ = this.playlist$.pipe(
      shareReplay(),
      mergeMap(r => r.tracks.data),
      map(song => song.artist.name),
      toArray(),
      map(songs => songs.sort((a,b) => a > b ? 1 : -1)),
      map(songs => [... new Set(songs)])
    )
  }

  clear() {
    this.searchTerm = '';
    this.activeFilter = '';
    this.activeSort = {
      name: '',
      order: '',
      type: ''
    }
  }
}
