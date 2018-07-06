import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrderItem } from './order-item.model';
import { OrderItemService } from './order-item.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-order-item',
    templateUrl: './order-item.component.html'
})
export class OrderItemComponent implements OnInit, OnDestroy {
orderItems: OrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private orderItemService: OrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.orderItemService.query().subscribe(
            (res: HttpResponse<OrderItem[]>) => {
                this.orderItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInOrderItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: OrderItem) {
        return item.id;
    }
    registerChangeInOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('orderItemListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
