import os
import subprocess
from sqlalchemy.exc import OperationalError

from app.database import SessionLocal
from app.models import Note, User, Tag, Folder
from app.utils.security import hash_password

ENV = os.getenv("ENV", "development")

def seed_user(db):
    if not db.query(User).count() > 0:
        print("👤 Seeding users...")

        users = [
            User(id=1, fname="john", lname="doe", email="john.doe@example.net", hashed_password=hash_password("aBcD78%JoHn@")),
            User(id=2, fname="Alice", lname="Smith", email="alice.smith@example.net", hashed_password=hash_password("Al!ceSmi77")),
            User(id=3, fname="Bob", lname="Johnson", email="bobjohnson@example.net", hashed_password=hash_password("B0bJ@hn123")),
            User(id=4, fname="Emma", lname="Williams", email="emma.williams@example.net", hashed_password=hash_password("Em#maWi1122")),
            User(id=5, fname="Liam", lname="Brown", email="liam.brown@example.net", hashed_password=hash_password("LiAmBr#88")),
            User(id=6, fname="Olivia", lname="Jones", email="olivia.jones@example.net", hashed_password=hash_password("Oli@Via99")),
            User(id=7, fname="Noah", lname="Garcia", email="noah.garcia@example.net", hashed_password=hash_password("N0@ahG777")),
            User(id=8, fname="Ava", lname="Miller", email="ava.miller@example.net", hashed_password=hash_password("AvaM!ll$88")),
            User(id=9, fname="William", lname="Davis", email="william.davis@example.net", hashed_password=hash_password("W!llD@v999")),
            User(id=10, fname="Sophia", lname="Martinez", email="sophia.martinez@example.net", hashed_password=hash_password("S0phM@rt45")),
        ]
        db.add_all(users)
        db.commit()
        print("✅ Seeded users.")

    else:
        print("⚠️  users already exist. Skipping.")
        return

def seed_note(db):
    if not db.query(Note).count() > 0:
        print("📝 Seeding notes...")
        
        user1 = db.query(User).filter(User.id == 1).first()
        user2 = db.query(User).filter(User.id == 2).first()

        notes = [
            Note(id=1, owner=user1, title="First Dummy Note!", content="My entirely dummy content..."),
            Note(id=2, owner=user1, title="John's second Dummy Note!", content="John's second entirely dummy content..."),
            Note(id=3, owner=user2, title="Alice's Dummy Note!", content="Alice's entirely dummy content...")
        ]

        db.add_all(notes)
        db.commit()
        print("✅ Seeded notes.")

    else:
        print("⚠️  notes already exist. Skipping.")
        return

def seed_folder(db):
    if not db.query(Folder).count() > 0:
        print("📁 Seeding Folder...")

        folders = [
            Folder(name='general'),
            Folder(name='work'),
            Folder(name='food')
        ]

        db.add_all(folders)
        db.commit()
        print("✅ Seeded Folders.")

    else:
        print("⚠️ folders already exist. Skipping.")
        return

def seed_tag(db):
    if not db.query(Tag).count() > 0:
        print("🏷️ Seeding Tag...")

        tags = [
            Tag(name='AI/ML'),
            Tag(name='freelance'),
            Tag(name='python'),
            Tag(name='general')
        ]

        db.add_all(tags)
        db.commit()
        print("✅ Seeded Tags.")
        
    else:
        print("⚠️  tags already exist. Skipping.")
        return

def seed_note_with_folder_and_tag(db):
    note = db.query(Note).filter(Note.id == 1).first()
    if not note:
        print("❌ Note with id=1 not found.")
        return
    
    general_tag = db.query(Tag).filter(Tag.name == 'general').first()
    if not general_tag:
        print("❌ Tag 'general' not found.")
        return
    
    if general_tag not in note.tags:
        note.tags.append(general_tag)

    general_folder = db.query(Folder).filter(Folder.name == 'general').first()
    if not general_folder:
        print("❌ Folder 'general' not found.")
        return
    note.folder = general_folder

    db.commit()
    print("✅ Seeded Note with Folder and Tag")

def main():
    if ENV != "development":
        print("⚠️  Skipping seed — not in development environment.")
        return

    try:
        with SessionLocal() as db:
            seed_user(db)
            seed_note(db)
            seed_folder(db)
            seed_tag(db)
            seed_note_with_folder_and_tag(db)
    except OperationalError as e:
        if "no such table" in str(e):
            print("⚙️  Running Alembic migrations because DB is empty...")
            subprocess.run(["alembic", "upgrade", "head"])
            with SessionLocal() as db:
                seed_user(db)
                seed_note(db)
                seed_folder(db)
                seed_tag(db)
                seed_note_with_folder_and_tag(db)
        else:
            raise

if __name__ == "__main__":
    main()
    