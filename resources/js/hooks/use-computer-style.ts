const useComputedStyle = () => {
    const style = getComputedStyle(document.body);

    const cssVars = {
        background: style.getPropertyValue('--color-background').trim(),
        foreground: style.getPropertyValue('--color-foreground').trim(),

        fontSans: style.getPropertyValue('--font-sans').trim(),
        fontMono: style.getPropertyValue('--font-mono').trim(),
        fontDancing: style.getPropertyValue('--font-dancing').trim(),

        sidebar: style.getPropertyValue('--color-sidebar').trim(),
        sidebarForeground: style.getPropertyValue('--color-sidebar-foreground').trim(),
        sidebarPrimary: style.getPropertyValue('--color-sidebar-primary').trim(),
        sidebarPrimaryForeground: style.getPropertyValue('--color-sidebar-primary-foreground').trim(),
        sidebarAccent: style.getPropertyValue('--color-sidebar-accent').trim(),
        sidebarAccentForeground: style.getPropertyValue('--color-sidebar-accent-foreground').trim(),
        sidebarBorder: style.getPropertyValue('--color-sidebar-border').trim(),
        sidebarRing: style.getPropertyValue('--color-sidebar-ring').trim(),

        chart1: style.getPropertyValue('--color-chart-1').trim(),
        chart2: style.getPropertyValue('--color-chart-2').trim(),
        chart3: style.getPropertyValue('--color-chart-3').trim(),
        chart4: style.getPropertyValue('--color-chart-4').trim(),
        chart5: style.getPropertyValue('--color-chart-5').trim(),

        primary: style.getPropertyValue('--color-primary').trim(),
        primaryForeground: style.getPropertyValue('--color-primary-foreground').trim(),

        secondary: style.getPropertyValue('--color-secondary').trim(),
        secondaryForeground: style.getPropertyValue('--color-secondary-foreground').trim(),

        accent: style.getPropertyValue('--color-accent').trim(),
        accentForeground: style.getPropertyValue('--color-accent-foreground').trim(),

        muted: style.getPropertyValue('--color-muted').trim(),
        mutedForeground: style.getPropertyValue('--color-muted-foreground').trim(),

        destructive: style.getPropertyValue('--color-destructive').trim(),

        border: style.getPropertyValue('--color-border').trim(),
        input: style.getPropertyValue('--color-input').trim(),
        ring: style.getPropertyValue('--color-ring').trim(),

        card: style.getPropertyValue('--color-card').trim(),
        cardForeground: style.getPropertyValue('--color-card-foreground').trim(),

        popover: style.getPropertyValue('--color-popover').trim(),
        popoverForeground: style.getPropertyValue('--color-popover-foreground').trim(),

        radiusSm: style.getPropertyValue('--radius-sm').trim(),
        radiusMd: style.getPropertyValue('--radius-md').trim(),
        radiusLg: style.getPropertyValue('--radius-lg').trim(),
        radiusXl: style.getPropertyValue('--radius-xl').trim(),
        radius2xl: style.getPropertyValue('--radius-2xl').trim(),
        radius3xl: style.getPropertyValue('--radius-3xl').trim(),
        radius4xl: style.getPropertyValue('--radius-4xl').trim(),

        animCollapsibleDown: style.getPropertyValue('--animate-collapsible-down').trim(),
        animCollapsibleUp: style.getPropertyValue('--animate-collapsible-up').trim(),
    };

    return {
        cssVars,
    };
};

export default useComputedStyle;
