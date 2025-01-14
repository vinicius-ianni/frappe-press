# Copyright (c) 2025, Frappe and contributors
# For license information, please see license.txt

from __future__ import annotations

# import frappe
from frappe.model.document import Document


class PhysicalBackupRestorationStep(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		method_name: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		status: DF.Literal["Pending", "Running", "Success", "Failure", "Skipped", "Delivery Failure"]
		step_job: DF.Link | None
		step_play: DF.Link | None
		step_title: DF.Data
	# end: auto-generated types

	pass
