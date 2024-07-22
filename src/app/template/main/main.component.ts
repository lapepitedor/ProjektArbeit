import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-main', 
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit
{
    mode: any = 'side';
    openSidenav: boolean = true;
    lang: string = 'en';
    isExpanded: boolean = true;
    isMobile: boolean = false;

    @ViewChild('sidenav') sidenav!: MatSidenav;
    constructor(protected breakpointObserver: BreakpointObserver, private router: Router)
    {
        breakpointObserver.observe(Breakpoints.XSmall).subscribe((breakPoint: any) =>
        {
            this.openSidenav = !breakPoint.matches
            this.isMobile = breakPoint.matches
            if (breakPoint.matches)
            {
                this.isExpanded = false;
            } else if (!breakPoint.matches)
            {
                this.isExpanded = true;
            }
        })
    }
    ngOnInit(): void
    {

    }

    toggleUpdate(event: any)
    {
        console.log("mode", event);
        this.toggleSidePanel(this.mode)
    }

    toggleSidePanel(mode: string)
    {

        if (mode == 'side' && this.isMobile)
        {
            this.mode = 'over'
        } else
        {
            this.mode = 'side'
        }
        if (!this.isMobile)
        {
            this.isExpanded = !this.isExpanded
        } else if (mode == 'over' && this.isMobile)
        {
            this.isExpanded = false;
        } else if (mode)
        {
            this.isExpanded = false
        }
        this.sidenav.toggle();
    }

}
