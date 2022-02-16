# -*- coding: utf-8 -*-
"""Public section, including homepage and signup."""
from flask import Blueprint, current_app, jsonify, make_response, redirect, render_template, request, url_for
from sportblurbs.database import get_documents, BLURB_COLLECTION

from sportblurbsserver.extensions import mongo

blueprint = Blueprint("public", __name__, static_folder="../static")


@blueprint.route("/")
def home():
    """Home page."""
    return render_template("public/home.html")


posts_per_load = 20  # num posts to return per request


@blueprint.route("/load")
def load():
    """ Route to return the posts """
    if request.args:
        counter = int(request.args.get("c"))  # The 'counter' value sent in the QS
        league = request.args.get("l")

        current_app.logger.info(f"Returning posts {counter} to {counter + posts_per_load}")
        # Slice counter -> quantity from the db
        blurbs = [
            {
                "name": b["player"]["name"],
                "position": b["player"]["position"],
                "team": b["player"]["team"],
                "date": b["date"],
                "news": b["blurb"]["news"],
                "spin": b["blurb"]["spin"],
            }
            for b in get_documents(mongo.db, BLURB_COLLECTION)[counter: counter + posts_per_load]
        ]
        if len(blurbs) == 0:
            current_app.logger.info("No more blurbs")
            return make_response(jsonify({}), 200)
        else:
            current_app.logger.info(f"Returning {len(blurbs)} blurbs")
            return make_response(jsonify(blurbs), 200)

    return redirect(url_for("public.home"))


@blueprint.route("/about/")
def about():
    """About page."""
    return render_template("public/about.html")
