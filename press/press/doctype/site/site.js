// Copyright (c) 2019, Frappe and contributors
// For license information, please see license.txt

frappe.require('assets/press/js/ListComponent.js')
frappe.require('assets/press/js/SectionHead.js')
frappe.require('assets/press/js/SectionDescription.js')
frappe.require('assets/press/js/ActionBlock.js')

frappe.ui.form.on('Site', {
	onload: async function (frm) {

        // data fetch
        let overview_res = await frappe.call({
            method: 'press.api.site.overview',
            args: {name: frm.docname}
        });
        let backups_res = await frappe.call({
            method: 'press.api.site.backups',
            args: {name: frm.docname}
        });
        let jobs_res = await frappe.call({
            method: 'press.api.site.jobs',
            args: {name: frm.docname}
        });
        let logs_res = await frappe.call({
            method: 'press.api.site.logs',
            args: {name: frm.docname}
        });
        let activities_res = await frappe.call({
            method: 'press.api.site.activities',
            args: {name: frm.docname}
        });


        // data remaps
        let recent_activities = remap(overview_res.message.recent_activity, (d) => {
            return {
                title: d.action + ' by ' + d.owner,
                message: d.creation
            };
        });
        let installed_apps = remap(overview_res.message.installed_apps, (d) => {
            return {
                title: d.title,
                message: d.repository + '/' + d.repository + ':' + d.branch,
                tag: d.hash.substring(0,7),
                tag_type: 'indicator-pill blue'
            };
        });
        let domains = remap(overview_res.message.domains, (d) => {
            return {
                message: d.domain,
                tag: d.primary || "",
                tag_type: 'indicator-pill green'
            };
        });
        let backups = remap(backups_res.message, (d) => {
            return {
                message: d.creation
            }
        });
        let jobs = remap(jobs_res.message, (d) => {
            return {
                'title': d.job_type,
                'message': d.creation,
                'tag': d.status,
                'tag_type': "indicator-pill green" 
            }
        });
        let logs = remap(logs_res.message, (d) => {
            return {
                'title': d.name,
                'message': d.creation,
            }
        });
        let activities = remap(activities_res.message, (d) => {
            return {
                'title': d.action + ' by ' + d.owner,
                'message': d.creation
            }
        });

        // render
        
        // tab: Overview 

        // sec: Recent Activity
        new ListComponent(frm.get_field('recent_activity_block').$wrapper, {
            'data': recent_activities, 
            'template': title_with_message_and_tag_template
        });            

        // sec: Site Info
        frm.set_value('created_on', frm.doc['creation']);
        frm.set_value('last_deployed', frm.doc['creation']);        // TODO: get the actual value
        new ActionBlock(frm.get_field('site_info_block').$wrapper, {
            'title': 'Deactivate Site',
            'description': "The site will go inactive and won't be publicly accessible",
            'button': {
                'title': 'Deactivate Site',
                'onclick': () => {
                    frappe.msgprint(__('Deactivate Site'));
                }
            }
        });
        new ActionBlock(frm.get_field('site_info_block').$wrapper, {
            'title': 'Drop Site',
            'description': "Once you drop site your site, there is no going back",
            'button': {
                'title': 'Drop Site',
                'onclick': () => {
                    frappe.msgprint(__('Drop Site'));
                },
                'tag': 'danger'
            }
        });

        // sec: Apps
        new SectionHead(frm.get_field('site_apps_block').$wrapper, {
            'title': 'Apps', 
            'button': {
                'title': 'Add App', 
                'onclick': () => {
                    frappe.msgprint(__('Add App'));
                }
            }
        });
        new SectionDescription(frm.get_field('site_apps_block').$wrapper, {
            'description': 'Apps installed on your site'
        });
        new ListComponent(frm.get_field('site_apps_block').$wrapper, {
            'data': installed_apps, 
            'template': title_with_message_and_tag_template
        });

        // sec: Domains
        new SectionHead(frm.get_field('site_domain_block').$wrapper, {
            'title': 'Domains', 
            'button': {
                'title': 'Add Domain', 
                'onclick': () => {
                    frappe.msgprint(__('Add Domain'))
                }
            }
        });
        new SectionDescription(frm.get_field('site_domain_block').$wrapper, {
            'description': 'Domains pointing to your site'
        });
        new ListComponent(frm.get_field('site_domain_block').$wrapper, {
            'data': domains, 
            'template': title_with_message_and_tag_template
        });

        // tab: Analytics

        // tab: Backup & Restore

        // sec: Backup
        new SectionHead(frm.get_field('site_backups_block').$wrapper, {
            'title': 'Backup',
            'button': {
                'title': 'Schedule a Backup',
                'onclick': () => {
                    frappe.msgprint(__('Schedule a Backup'));
                }
            }
        });
        new ListComponent(frm.get_field('site_backups_block').$wrapper, {
            'data': backups,
            'template': title_with_message_and_tag_template
        });

        // sec: Restore, Migrate and Reset
        new ActionBlock(frm.get_field('restore_migrate_and_reset_block').$wrapper, {
            'title': 'Restore',
            'description': "Restore your database using a previous backup",
            'button': {
                'title': 'Restore Database',
                'onclick': () => {
                    frappe.msgprint(__('Restore Database'));
                }
            }
        });
        new ActionBlock(frm.get_field('restore_migrate_and_reset_block').$wrapper, {
            'title': 'Migrate',
            'description': "Run bench migrate command on your database",
            'button': {
                'title': 'Migrate Database',
                'onclick': () => {
                    frappe.msgprint(__('Migrate Database'));
                }
            }
        });
        new ActionBlock(frm.get_field('restore_migrate_and_reset_block').$wrapper, {
            'title': 'Reset',
            'description': "Reset your database to a clean state",
            'button': {
                'title': 'Reset Database',
                'onclick': () => {
                    frappe.msgprint(__('Reset Database'));
                },
                'tag': 'danger'
            }
        });
        new ActionBlock(frm.get_field('restore_migrate_and_reset_block').$wrapper, {
            'title': 'Clear Cache',
            'description': "Clear your site's cache",
            'button': {
                'title': 'Clear Cache',
                'onclick': () => {
                    frappe.msgprint(__('Clear Cache'));
                }
            }
        });

        // tab: Jobs

        // sec: Jobs
        new SectionHead(frm.get_field('jobs_block').$wrapper, {
            'title': 'Jobs'
        });
        new SectionDescription(frm.get_field('jobs_block').$wrapper, {
            'description': 'History of jobs that ran on your site'
        });
        new ListComponent(frm.get_field('jobs_block').$wrapper, {
            'data': jobs,
            'template': title_with_message_and_tag_template
        });

        // tab: Logs

        // sec: Logs
        new SectionHead(frm.get_field('logs_block').$wrapper, {
            'title': 'Logs'
        });
        new SectionDescription(frm.get_field('logs_block').$wrapper, {
            'description': 'Available Logs for your site'
        });
        new ListComponent(frm.get_field('logs_block').$wrapper, {
            'data': logs,
            'template': title_with_message_and_tag_template
        });

        // tab: Activity

        // sec: Activity
        new SectionHead(frm.get_field('activity_block').$wrapper, {
            'title': 'Activity'
        });
        new SectionDescription(frm.get_field('activity_block').$wrapper, {
            'description': 'Log of activities performed on your site'
        });
        new ListComponent(frm.get_field('activity_block').$wrapper, {
            'data': activities,
            'template': title_with_message_and_tag_template
        });

        // tab: Settings

        console.log(frm.get_field('site_config_json').value);

		frm.set_query('bench', function () {
			return {
				filters: {
					server: frm.doc.server,
					status: 'Active',
				},
			};
		});
		frm.set_query('host_name', () => {
			return {
				filters: {
					site: frm.doc.name,
					status: 'Active'
				},
			};
		});
	},
	refresh: function (frm) {
		frm.dashboard.set_headline_alert(
			`<div class="container-fluid">
				<div class="row">
					<div class="col-sm-4">CPU Usage: ${frm.doc.current_cpu_usage}%</div>
					<div class="col-sm-4">Database Usage: ${frm.doc.current_database_usage}%</div>
					<div class="col-sm-4">Disk Usage: ${frm.doc.current_disk_usage}%</div>
				</div>
			</div>`
		);
		frm.add_web_link(`https://${frm.doc.name}`, __('Visit Site'));
		frm.add_web_link(
			`/dashboard/sites/${frm.doc.name}`,
			__('Visit Dashboard')
		);

		[
			[__('Backup'), 'backup'],
		].forEach(([label, method]) => {
			frm.add_custom_button(
				label,
				() => { frm.call(method).then((r) => frm.refresh()) },
				__('Actions')
			);
		});
		[
			[__('Archive'), 'archive'],
			[__('Cleanup after Archive'), 'cleanup_after_archive'],
			[__('Migrate'), 'migrate'],
			[__('Reinstall'), 'reinstall'],
			[__('Restore'), 'restore_site'],
			[__('Restore Tables'), 'restore_tables'],
			[__('Clear Cache'), 'clear_cache'],
			[__('Update'), 'schedule_update'],
			[__('Deactivate'), 'deactivate'],
			[__('Activate'), 'activate'],
		].forEach(([label, method]) => {
			frm.add_custom_button(
				label,
				() => {
					frappe.confirm(
						`Are you sure you want to ${label.toLowerCase()} this site?`,
						() => frm.call(method).then((r) => frm.refresh())
					);
				},
				__('Actions')
			);
		});
		[
			[__('Suspend'), 'suspend'],
			[__('Unsuspend'), 'unsuspend'],
		].forEach(([label, method]) => {
			frm.add_custom_button(
				label,
				() => {
					frappe.prompt(
						{ fieldtype: 'Data', label: 'Reason', fieldname: 'reason', reqd: 1 },
						({ reason }) => {
							frm.call(method, { reason }).then((r) => frm.refresh());
						},
						__('Provide Reason')
					);
				},
				__('Actions')
			);
		});
		frm.toggle_enable(['host_name'], frm.doc.status === 'Active');
	},
});

// templates
function title_with_message_and_tag_template(data) {
    let title = data.title || '';
    let message = data.message || '';
    let tag = data.tag || '';
    let tag_type = data.tag_type || '';

    return `
        <div class="d-flex flex-column">
            <div class="d-flex flex-column">
                <h5>${title || ""}</h5>
            </div>
            <div class="d-flex flex-row justify-between">
                <p>${message || ""}</p>
                <p class="${tag_type}">${tag || ""}</p>
            </div>
        </div>
    `;
}



// util functions
function remap(data, data_template) {
    let new_data = [];
    for(let d of data) {
        new_data.push(data_template(d));
    }
    return new_data;
}