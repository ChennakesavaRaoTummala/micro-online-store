import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Shipment } from './shipment.model';
import { ShipmentService } from './shipment.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-shipment',
    templateUrl: './shipment.component.html'
})
export class ShipmentComponent implements OnInit, OnDestroy {
shipments: Shipment[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private shipmentService: ShipmentService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.shipmentService.query().subscribe(
            (res: HttpResponse<Shipment[]>) => {
                this.shipments = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInShipments();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Shipment) {
        return item.id;
    }
    registerChangeInShipments() {
        this.eventSubscriber = this.eventManager.subscribe('shipmentListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
