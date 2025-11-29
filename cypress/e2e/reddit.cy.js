describe('Reddit client basic flow', () => {
  beforeEach(() => {
    cy.visit('/'); // ใช้ baseUrl จาก config
  });

  it('แสดงโพสต์แรกเริ่มและ sidebar subreddits', () => {
    // มีหัวข้อ Subreddits
    cy.contains('Subreddits').should('be.visible');

    // มีการ์ดโพสต์อย่างน้อย 1 อัน
    cy.get('.post-card').its('length').should('be.greaterThan', 0);
  });

  it('สามารถค้นหาโพสต์ และแสดงข้อความไม่มีผลลัพธ์', () => {
    // พิมพ์คำมั่ว ๆ แล้ว submit
    cy.get('input[placeholder="Search in titles..."]').type('asldkfjzzxxqq{enter}');

    cy.contains('No posts match:').should('be.visible');
  });

  it('สามารถเปลี่ยน subreddit ได้ และมีโพสต์ให้ดู', () => {
    // เลือกปุ่ม subreddit อันที่ 2 (กันกรณีอันแรกเป็นอันเดิม)
    cy.get('.subreddits-list button').eq(1).click();

    // หลังเปลี่ยน subreddit ควรมี skeleton แป๊บ ๆ แล้วก็มีโพสต์
    cy.get('.post-card').its('length').should('be.greaterThan', 0);
  });

  it('สามารถเปิดคอมเมนต์ของโพสต์ได้', () => {
    // หาโพสต์อันแรก
    cy.get('.post-card').first().as('firstPost');

    // กดปุ่ม Show Comments ในโพสต์แรก
    cy.get('@firstPost')
      .find('button')
      .contains(/show comments/i)
      .click();

    // หลังจากนั้นควรเห็นอย่างน้อยอย่างใดอย่างหนึ่ง: loading / error / comment text
    cy.get('@firstPost')
      .find('.comments-wrapper')
      .should('be.visible');
  });
});
