# -*- coding: utf-8 -*-
"""Public section, including homepage and signup."""
from flask import (
    Blueprint,
    current_app,
    render_template,
)

blueprint = Blueprint("public", __name__, static_folder="../static")


# @blueprint.route("/", methods=["GET", "POST"])
@blueprint.route("/")
def home():
    """Home page."""
    current_app.logger.info("Hello from the home page!")
    return render_template("public/home.html")


@blueprint.route("/about/")
def about():
    """About page."""
    return render_template("public/about.html")
