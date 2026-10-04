// Language-independent facts about each module, checked against the Stepup codebase.
// Text (name, summary, features) lives in content/modules.en.js and content/modules.fr.js.
//
// aiCap: only set where the product enforces a ceiling on the module's AI agent.

export const MODULES = [
  { slug: 'audits', family: 'opex', icon: 'SearchCheck', links: ['quality', 'tasks'] },
  { slug: 'quality', family: 'opex', icon: 'RefreshCcw', links: ['audits', 'meetings', 'kaizen', 'tasks'] },
  { slug: 'kaizen', family: 'opex', icon: 'Lightbulb', links: ['quality', 'projects', 'maintenance', 'tasks'] },
  { slug: 'documents', family: 'opex', icon: 'FileText', links: ['tasks', 'hr'] },
  { slug: 'meetings', family: 'opex', icon: 'MessagesSquare', links: ['quality', 'tasks'] },
  { slug: 'tasks', family: 'opex', icon: 'ListChecks', links: ['quality', 'meetings', 'kaizen', 'documents', 'maintenance', 'helpdesk'] },
  { slug: 'projects', family: 'opex', icon: 'GanttChart', links: ['kaizen', 'tasks', 'hr'] },

  { slug: 'talents', family: 'people', icon: 'Award', links: ['hr', 'training'], aiCap: 1 },
  { slug: 'evaluations', family: 'people', icon: 'ClipboardCheck', links: ['training', 'quality', 'tasks'], aiCap: 0 },
  { slug: 'training', family: 'people', icon: 'GraduationCap', links: ['evaluations', 'talents'] },
  { slug: 'hr', family: 'people', icon: 'Users', links: ['recruitment', 'talents', 'tasks'], aiCap: 2 },
  { slug: 'recruitment', family: 'people', icon: 'UserPlus', links: ['hr', 'talents'], aiCap: 0 },

  { slug: 'crm', family: 'business', icon: 'Handshake', links: ['marketing', 'sales', 'helpdesk', 'tasks'] },
  { slug: 'marketing', family: 'business', icon: 'Megaphone', links: ['crm'] },
  { slug: 'sales', family: 'business', icon: 'ShoppingCart', links: ['crm'] },
  { slug: 'purchase', family: 'business', icon: 'Truck', links: ['crm'] },
  { slug: 'accounting', family: 'business', icon: 'Calculator', links: ['crm'], aiCap: 0 },
  { slug: 'reporting', family: 'business', icon: 'BarChart3', links: [] },

  { slug: 'inventory', family: 'plant', icon: 'Boxes', links: [] },
  { slug: 'manufacturing', family: 'plant', icon: 'Factory', links: [] },
  { slug: 'maintenance', family: 'plant', icon: 'Wrench', links: ['kaizen', 'tasks'] },
  { slug: 'iot', family: 'plant', icon: 'Cpu', links: [] },
  { slug: 'helpdesk', family: 'plant', icon: 'LifeBuoy', links: ['crm', 'tasks'] },
]

export const PACK_MODULES = {
  'Starter Essentiel': ['crm', 'marketing', 'projects', 'documents'],
  'Qualité ISO': ['quality', 'audits', 'kaizen', 'documents', 'tasks'],
  'PMO & Projets': ['projects', 'documents', 'reporting', 'meetings', 'tasks'],
  'RH & Talents': ['hr', 'training', 'talents', 'evaluations', 'documents', 'tasks'],
  Manufacturing: ['manufacturing', 'maintenance', 'inventory', 'purchase', 'quality'],
}

// The Enterprise pack activates every module except these (backend/core/tenants/module_packs.py).
export const NOT_IN_ENTERPRISE = ['iot', 'recruitment']
