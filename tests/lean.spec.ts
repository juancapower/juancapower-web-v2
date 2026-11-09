import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`Accessible commercial links at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/juancapower-web-v2/');
    const contact = page.getByRole('link', { name: 'Escribir a JuanCa Power por WhatsApp' });
    const whatsapp = new URL((await contact.getAttribute('href'))!);
    expect(whatsapp.origin + whatsapp.pathname).toBe('https://wa.me/51963335717');
    expect(whatsapp.searchParams.get('text')).toBe('¡Hola, JuanCa! 👋 Llegué desde tu página web y me gustaría conversar contigo sobre tus programas, talleres o servicios.');
    await expect(contact).toBeInViewport();
    const button = (await contact.boundingBox())!;
    expect(button.width).toBeGreaterThanOrEqual(44);
    expect(button.height).toBeGreaterThanOrEqual(44);
    expect(await contact.evaluate(el => getComputedStyle(el).position)).toBe('fixed');
    const social = page.getByRole('navigation', { name: 'Redes sociales' });
    await expect(social.getByRole('link', { name: 'TikTok de JuanCa Power' })).toHaveAttribute('href', 'https://www.tiktok.com/@soyjuancapower');
    await expect(social.getByRole('link', { name: 'Instagram de JuanCa Power' })).toHaveAttribute('href', 'https://www.instagram.com/soyjuancapower/');
    await expect(social.locator('svg[aria-hidden="true"]')).toHaveCount(2);
    await social.scrollIntoViewIfNeeded();
    await expect(contact).toBeInViewport();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    await page.screenshot({ path: info.outputPath(`footer-${width}.png`) });
  });
}
