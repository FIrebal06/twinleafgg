import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Format } from 'ptcg-server';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeckItem } from 'src/app/deck/deck-card/deck-card.interface';
import { FormatValidator } from 'src/app/util/formats-validator';

@Component({
  selector: 'ptcg-deck-validity',
  templateUrl: './deck-validity.component.html',
  styleUrls: ['./deck-validity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeckValidityComponent {

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
  ];

  @Input() validOnly = false;

  @Input() validFormats: number[] | null = null;

  @Input()
  set deck(cards: DeckItem[]) {
    this._deck.next(cards);
  }

  _deck = new BehaviorSubject<DeckItem[]>(null);
  deck$ = this._deck.asObservable();

  validFormats$ = this.deck$.pipe(
    map(cards => {
      if (this.validFormats) {
        return this.validFormats;
      }
      const cardList = [];
      cards?.forEach(card => {
        for (let i = 0; i < card.count; i++) {
          cardList.push(card.card);
        }
      });
      return FormatValidator.getValidFormatsForCardList(cardList);
    })
  );
}
