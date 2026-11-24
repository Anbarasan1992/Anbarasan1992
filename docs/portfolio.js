const projects = {
  erp: {
    category: 'ERP & integration',
    title: 'Manufacturing ERP',
    summary: 'Manufacturing workflows that connect production plans, inventory, procurement, and ERP master data.',
    steps: [
      'Translate production plans into material requirements.',
      'Check stock and support purchasing workflows.',
      'Synchronize master data with SAP Business One.',
    ],
  },
  kanban: {
    category: 'Supply chain',
    title: 'Kanban & supplier planning',
    summary: 'Planning workflows that connect customer demand with supplier and dispatch decisions.',
    steps: [
      'Review demand and safety-stock requirements.',
      'Allocate requirements across suppliers.',
      'Coordinate dispatch against the supply plan.',
    ],
  },
  vendor: {
    category: 'Procurement',
    title: 'Vendor portal',
    summary: 'A supplier-facing interface for purchase orders, acknowledgements, and invoices.',
    steps: [
      'Share purchase orders with suppliers.',
      'Collect supplier acknowledgements.',
      'Coordinate invoice submissions with procurement.',
    ],
  },
  estimation: {
    category: 'Costing & quotations',
    title: 'Engineering estimation',
    summary: 'Estimation workflows that carry bill-of-materials costs into quotations and approvals.',
    steps: [
      'Use the bill of materials to prepare a cost estimate.',
      'Create and revise the quotation.',
      'Route the quotation for approval.',
    ],
  },
};

const dialog = document.querySelector('#project-detail');
const category = document.querySelector('#detail-category');
const title = document.querySelector('#detail-title');
const summary = document.querySelector('#detail-summary');
const steps = document.querySelector('#detail-steps');

for (const button of document.querySelectorAll('[data-project]')) {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    category.textContent = project.category;
    title.textContent = project.title;
    summary.textContent = project.summary;
    steps.replaceChildren(...project.steps.map((step) => {
      const item = document.createElement('li');
      item.textContent = step;
      return item;
    }));
    dialog.showModal();
  });
}

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const canvas = document.querySelector('#stars');
const context = canvas.getContext('2d');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (context) {
  const stars = Array.from({ length: 96 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 1.2 + 0.35,
    phase: Math.random() * Math.PI * 2,
  }));
  let width;
  let height;
  let lastDraw = 0;
  let frameId;

  function draw(timestamp) {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      const alpha = 0.36 + Math.sin(star.phase + timestamp / 1600) * 0.23;
      context.fillStyle = 'rgba(203, 235, 195, ' + alpha + ')';
      context.fillRect(star.x * width, star.y * height, star.radius, star.radius);
    }
  }

  function animate(timestamp) {
    if (timestamp - lastDraw >= 1000 / 24) {
      draw(timestamp);
      lastDraw = timestamp;
    }
    frameId = window.requestAnimationFrame(animate);
  }

  function updateAnimation() {
    window.cancelAnimationFrame(frameId);
    if (motionPreference.matches || document.hidden) {
      draw(0);
    } else {
      frameId = window.requestAnimationFrame(animate);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    draw(0);
  }

  new ResizeObserver(resize).observe(canvas);
  motionPreference.addEventListener('change', updateAnimation);
  document.addEventListener('visibilitychange', updateAnimation);
  resize();
  updateAnimation();
}
